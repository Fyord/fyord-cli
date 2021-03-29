/* eslint-disable max-lines */
import * as puppeteer from 'puppeteer';
import { Command, Result, Strings } from 'tsbase';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../fileSystem/module';
import { Settings } from '../../settings/settings';
import { ISettingsService, SettingsService } from '../../settings/settingsService';
import { IOperation } from './operation';

export interface IPage {
  on(event: string, callback: (request: any) => void);
  setRequestInterception(on: boolean): void;
  waitForSelector(selector: string, options: any): Promise<void>;
  goto(url: string, options: any): Promise<void>;
  evaluate(callback: () => any): Promise<string[]>;
  content(): Promise<string>;
}

export interface IBrowser {
  newPage(): Promise<IPage>;
  close(): Promise<void>;
}

export interface IPuppeteer {
  launch(): Promise<IBrowser>;
}

export class PreRenderOperation implements IOperation {
  private config: {
    baseUrl: string | string[],
    outputPathRoot: string | string[],
    blockedResourceTypes: string[],
    skippedResources: string[],
    dynamicRenderModeString: string,
    staticRenderModeString: string,
    hybridRenderModeString: string,
    bundleScriptRegex: RegExp,
    unsupportedBrowserScript: string | string[],
  };

  private pagesToCrawl = ['/'];
  private crawledPages = ['/'];
  private errors = new Array();
  private siteMap = new Array();

  constructor(
    private browser: IPuppeteer = puppeteer,
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    settingsService: ISettingsService = SettingsService.Instance()
  ) {
    this.config = {
      baseUrl: settingsService.GetSettingOrDefault(Settings.BaseUrl),
      outputPathRoot: settingsService.GetSettingOrDefault(Settings.OutputPathRoot),
      blockedResourceTypes: settingsService.GetSettingOrDefault(Settings.BlockedResourceTypes) as string[],
      skippedResources: settingsService.GetSettingOrDefault(Settings.SkippedResources) as string[],
      dynamicRenderModeString: settingsService.GetSettingOrDefault(Settings.DynamicRenderModeString) as string,
      staticRenderModeString: settingsService.GetSettingOrDefault(Settings.StaticRenderModeString) as string,
      hybridRenderModeString: settingsService.GetSettingOrDefault(Settings.HybridRenderModeString) as string,
      bundleScriptRegex: new RegExp(settingsService.GetSettingOrDefault(Settings.BundleScriptRegex) as string),
      unsupportedBrowserScript: settingsService.GetSettingOrDefault(Settings.UnsupportedBrowserScript)
    };
  }

  public Execute(): Result {
    return new Command(() => {
      const getXmlSiteMap = () => {
        const xmlStart = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">`;
        const xmlEnd = '</urlset>';

        let xmlContent = Strings.Empty;
        this.siteMap.forEach(url => {
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
        const browser = await this.browser.launch();
        const page = await browser.newPage();
        await this.excludeMediaAndIntegrations(page);

        while (this.pagesToCrawl.length >= 1) {
          const pageToCrawl = this.pagesToCrawl.shift();

          try {
            if (pageToCrawl) {
              const linksOnPage = await this.renderPage(page, pageToCrawl);

              linksOnPage.forEach(linkHref => {
                if (this.crawledPages.indexOf(linkHref) < 0 && this.pagesToCrawl.indexOf(linkHref) < 0) {
                  this.pagesToCrawl.push(linkHref);
                }
              });
            }
          } catch (error) {
            console.error(error);
            this.errors.push({ page: pageToCrawl, error: error.toString() });
          }
        }

        await this.fse.outputFile(`${this.config.outputPathRoot}/sitemap.json`, JSON.stringify({ urlset: this.siteMap }));
        await this.fse.outputFile(`${this.config.outputPathRoot}/sitemap.xml`, getXmlSiteMap());
        await this.fse.outputFile(`${this.config.outputPathRoot}/errors.json`, JSON.stringify(this.errors));

        console.log(`Completed crawling ${this.crawledPages.length} pages with ${this.errors.length} errors.`);

        await browser.close();
      })();
    }).Execute();
  }

  private addEntrySiteMap(loc): void {
    this.siteMap.push({
      loc: loc,
      lastmod: (new Date().toLocaleDateString().replace(/\//g, '-')),
      changefreq: 'weekly',
      priority: 1
    });
  }

  private async excludeMediaAndIntegrations(page: IPage) {
    await page.setRequestInterception(true);

    page.on('request', (pageRequest) => {
      const url = pageRequest._url.split('?')[0].split('#')[0];
      if (this.requestIsMediaOrBlockedResource(pageRequest, url)) {
        pageRequest.abort();
      } else {
        pageRequest.continue();
      }
    });
  }

  private async getPathsForLinksOnPage(page: IPage) {
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

  private requestIsMediaOrBlockedResource(pageRequest, url) {
    return this.config.blockedResourceTypes.indexOf(pageRequest.resourceType()) !== -1 ||
      this.config.skippedResources.some(resource => url.indexOf(resource) !== -1);
  }

  // eslint-disable-next-line complexity
  private async renderPage(page: IPage, route: string) {
    this.crawledPages.push(route);
    const pageName = (route === Strings.Empty || route === '/') ? 'index' : route;
    const url = `${this.config.baseUrl}${route}`;

    console.log(`| ========= Attempting to crawl: ${pageName} ========= |`);

    await page.goto(url, { waitUntil: 'networkidle2' });

    let content = await page.content();
    content = content.replace(/\r?\n|\r/g, Strings.Empty).replace(/>\s+</g, '><');

    if (content.indexOf(this.config.staticRenderModeString) >= 0) {
      content = content.replace(this.config.bundleScriptRegex, Strings.Empty);
    }

    if (content.indexOf(this.config.dynamicRenderModeString) < 0) {
      await this.fse.outputFile(`${this.config.outputPathRoot}/${pageName}.html`, content);
      this.addEntrySiteMap(url);
    } else {
      const bundleScript = content.match(this.config.bundleScriptRegex)?.[0] || Strings.Empty;
      const appRootDivString = '<div id="app-root">';
      const closingHtml = `${appRootDivString}</div>${this.config.unsupportedBrowserScript}${bundleScript}</body></html>`;

      if (content.indexOf(appRootDivString) >= 0) {
        let unRenderedVersion = content.split(appRootDivString)[0];
        unRenderedVersion = `${unRenderedVersion}${closingHtml}`;
        await this.fse.outputFile(`${this.config.outputPathRoot}/${pageName}.html`, unRenderedVersion);
        this.addEntrySiteMap(url);
      }
    }

    return await this.getPathsForLinksOnPage(page);
  }
}
