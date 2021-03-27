/* eslint-disable no-console */
import * as fse from 'fs-extra';
import * as puppeteer from 'puppeteer';
import { Strings } from 'tsbase';
import { Settings } from '../../settings/settings';
import { SettingsService } from '../../settings/settingsService';
import { Operation } from '../module';

export const PreRender: Operation = () => {
  const settingsService = SettingsService.Instance();

  const config = {
    baseUrl: settingsService.GetSettingOrDefault(Settings.BaseUrl),
    outputPathRoot: settingsService.GetSettingOrDefault(Settings.OutputPathRoot),
    blockedResourceTypes: settingsService.GetSettingOrDefault(Settings.BlockedResourceTypes) as string[],
    skippedResources: settingsService.GetSettingOrDefault(Settings.SkippedResources) as string[],
    dynamicRenderModeString: settingsService.GetSettingOrDefault(Settings.DynamicRenderModeString),
    staticRenderModeString: settingsService.GetSettingOrDefault(Settings.StaticRenderModeString),
    hybridRenderModeString: settingsService.GetSettingOrDefault(Settings.HybridRenderModeString),
    bundleScriptRegex: new RegExp(settingsService.GetSettingOrDefault(Settings.BundleScriptRegex) as string),
    unsupportedBrowserScript: settingsService.GetSettingOrDefault(Settings.UnsupportedBrowserScript)
  };

  const errors = new Array();
  const siteMap = new Array();
  const addEntrySiteMap = (loc) => siteMap.push({
    loc: loc,
    lastmod: (new Date().toLocaleDateString().replace(/\//g, '-')),
    changefreq: 'weekly',
    priority: 1
  });

  async function getPathsForLinksOnPage(page) {
    await page.waitForSelector('a', { timeout: 5000 });

    const linkPaths = await page.evaluate(() => {
      const pathNames = Array<string>();
      const linkElements = document.querySelectorAll('a');

      // @ts-ignore
      for (const element of linkElements) {
        if (element.href.indexOf(document.location.origin) >= 0) {
          pathNames.push(element.pathname);
        }
      }

      return pathNames;
    });

    return linkPaths;
  }

  async function renderPage(page, route) {
    const pageName = route === Strings.Empty ? 'index' : route;
    const url = `${config.baseUrl}${route}`;

    console.log(`| ========= Attempting to crawl: ${pageName} ========= |`);

    await page.goto(url, { waitUntil: 'networkidle2' });

    let content = await page.content();
    content = content.replace(/\r?\n|\r/g, Strings.Empty).replace(/>\s+</g, '><');

    if (content.indexOf(config.staticRenderModeString) >= 0) {
      content = content.replace(config.bundleScriptRegex, Strings.Empty);
    }

    if (content.indexOf(config.dynamicRenderModeString) < 0) {
      await fse.outputFile(`${config.outputPathRoot}/${pageName}.html`, content);
      addEntrySiteMap(url);
    } else {
      const bundleScript = content.match(config.bundleScriptRegex)[0] || Strings.Empty;
      const appRootDivString = '<div id="app-root">';
      const closingHtml = `${appRootDivString}</div>${config.unsupportedBrowserScript}${bundleScript}</body></html>`;

      if (content.indexOf(appRootDivString) >= 0) {
        let unRenderedVersion = content.split(appRootDivString)[0];
        unRenderedVersion = `${unRenderedVersion}${closingHtml}`;
        await fse.outputFile(`${config.outputPathRoot}/${pageName}.html`, unRenderedVersion);
        addEntrySiteMap(url);
      }
    }

    return await getPathsForLinksOnPage(page);
  }

  function requestIsMediaOrBlockedResource(pageRequest, url) {
    return config.blockedResourceTypes.indexOf(pageRequest.resourceType()) !== -1 ||
      config.skippedResources.some(resource => url.indexOf(resource) !== -1);
  }

  async function excludeMediaAndIntegrations(page) {
    await page.setRequestInterception(true);

    page.on('request', (pageRequest) => {
      const url = pageRequest._url.split('?')[0].split('#')[0];
      if (requestIsMediaOrBlockedResource(pageRequest, url)) {
        pageRequest.abort();
      } else {
        pageRequest.continue();
      }
    });
  }

  const getXmlSiteMap = () => {
    const xmlStart = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">`;
    const xmlEnd = '</urlset>';

    let xmlContent = Strings.Empty;
    siteMap.forEach(url => {
      xmlContent += `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>`;
    });

    return `${xmlStart}${xmlContent}
  ${xmlEnd}`;
  };

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await excludeMediaAndIntegrations(page);

    const pagesToCrawl = [Strings.Empty];
    const crawledPages = ['/'];

    while (pagesToCrawl.length >= 1) {
      const pageToCrawl = pagesToCrawl.shift();

      try {
        const linksOnPage = await renderPage(page, pageToCrawl);

        linksOnPage.forEach(linkHref => {
          if (crawledPages.indexOf(linkHref) < 0 && pagesToCrawl.indexOf(linkHref) < 0) {
            pagesToCrawl.push(linkHref);
          }
        });
      } catch (error) {
        console.error(error);
        errors.push({ page: pageToCrawl, error: error.toString() });
      }

      if (pageToCrawl) {
        crawledPages.push(pageToCrawl);
      }
    }

    await fse.outputFile(`${config.outputPathRoot}/sitemap.json`, JSON.stringify({ urlset: siteMap }));
    await fse.outputFile(`${config.outputPathRoot}/sitemap.xml`, getXmlSiteMap());
    await fse.outputFile(`${config.outputPathRoot}/errors.json`, JSON.stringify(errors));

    console.log(`Completed crawling ${crawledPages.length} pages with ${errors.length} errors.`);

    await browser.close();
  })();
};
