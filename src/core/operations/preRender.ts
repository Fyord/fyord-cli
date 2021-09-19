/* eslint-disable max-lines */
import * as puppeteer from 'puppeteer';
import * as expressjs from 'express';
import * as path from 'path';
import { AsyncCommand, Result, Strings } from 'tsbase';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../fileSystem/module';
import { ISettingsService, SettingsService, Settings } from '../../settings/module';
import { IOperation } from './operation';

export interface IPageRequest {
  _url: string,
  resourceType: () => string,
  abort: () => void,
  continue: () => void
}

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
  launch(options: any): Promise<IBrowser>;
}

export class PreRenderOperation implements IOperation {
  private config: {
    baseUrl: string,
    outputPathRoot: string,
    blockedResourceTypes: string[],
    skippedResources: string[]
  };

  private expressServerBase = 'http://localhost:7343';
  private pagesToCrawl = ['/'];
  private crawledPages = new Array<string>();
  private errors = new Array<{ page: string, error: string }>();
  private siteMap = new Array<{
    loc: string,
    lastmod: string,
    changefreq: string,
    priority: number
  }>();

  // eslint-disable-next-line max-params
  constructor(
    private createExpressApp = expressjs,
    private serveStatic = expressjs.static,
    private browser: IPuppeteer = puppeteer,
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    settingsService: ISettingsService = SettingsService.Instance(),
    private windowDocument?: Document
  ) {
    this.config = {
      baseUrl: settingsService.GetSettingOrDefault(Settings.BaseUrl),
      outputPathRoot: settingsService.GetSettingOrDefault(Settings.OutputPathRoot),
      blockedResourceTypes: settingsService.GetSettingOrDefault(Settings.BlockedResourceTypes)?.trim().split(','),
      skippedResources: settingsService.GetSettingOrDefault(Settings.SkippedResources)?.trim().split(',')
    };
  }

  public async Execute(): Promise<Result> {
    return await new AsyncCommand(async () => {
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

      const app = this.createExpressApp();
      const server = app.listen(7343, () => { });
      app.use(this.serveStatic('public'));
      app.use((_req, res) => {
        res.status(404).sendFile(path.join(process.cwd() + '/public/index.html'));
      });

      const browser = await this.browser.launch({ args: ['--disable-gpu'] });
      const page = await browser.newPage();
      await this.excludeMediaAndIntegrations(page);

      while (this.pagesToCrawl.length >= 1) {
        const pageToCrawl = this.pagesToCrawl.shift() as string;

        try {
          const linksOnPage = await this.renderPage(page, pageToCrawl);

          linksOnPage.forEach(linkHref => {
            if (this.crawledPages.indexOf(linkHref) < 0 && this.pagesToCrawl.indexOf(linkHref) < 0) {
              this.pagesToCrawl.push(linkHref);
            }
          });
        } catch (error) {
          this.errors.push({ page: pageToCrawl, error: (error as Error).toString() });
        }
      }

      await this.fse.outputFile(`${this.config.outputPathRoot}/sitemap.json`, JSON.stringify({ urlset: this.siteMap }));
      await this.fse.outputFile(`${this.config.outputPathRoot}/sitemap.xml`, getXmlSiteMap());
      await this.fse.outputFile(`${this.config.outputPathRoot}/errors.json`, JSON.stringify(this.errors));

      console.log(`Completed crawling ${this.crawledPages.length} pages${this.errors.length > 0 ? ' with errors' : Strings.Empty}.`);

      await browser.close();
      server.close();

      if (this.errors.length) {
        throw new Error(this.errors.map(e => e.error).join('\n'));
      }
    }).Execute();
  }

  private addEntrySiteMap(loc: string): void {
    const twoDigit = (value: number) => `${value < 10 ? '0' : ''}${value}`;
    const currentDate = new Date();
    const lastmodDate = `${currentDate.getFullYear()}-${twoDigit(currentDate.getMonth() + 1)}-${twoDigit(currentDate.getDate())}`;

    this.siteMap.push({
      loc: loc.replace(this.expressServerBase, this.config.baseUrl),
      lastmod: lastmodDate,
      changefreq: 'weekly',
      priority: 1
    });
  }

  private async excludeMediaAndIntegrations(page: IPage) {
    await page.setRequestInterception(true);

    page.on('request', (pageRequest: IPageRequest) => {
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
      const linkElements = (this.windowDocument || document).querySelectorAll('a');

      for (const element of Array.from(linkElements)) {
        if (element.href.indexOf((this.windowDocument || document).location.origin) >= 0) {
          pathNames.push(element.pathname);
        }
      }

      return pathNames;
    });

    return linkPaths;
  }

  private requestIsMediaOrBlockedResource(pageRequest: IPageRequest, url: string) {
    return this.config.blockedResourceTypes.indexOf(pageRequest.resourceType()) !== -1 ||
      this.config.skippedResources.some(resource => url.indexOf(resource) !== -1);
  }

  // eslint-disable-next-line complexity
  private async renderPage(page: IPage, route: string) {
    this.crawledPages.push(route);
    const pageName = (route === Strings.Empty || route === '/') ? 'index' : route;
    const url = `${this.expressServerBase}${route}`;

    console.log(`| ========= Attempting to crawl: ${pageName} ========= |`);

    await page.goto(url, { waitUntil: 'networkidle2' });

    let content = await page.content();
    content = content.replace(/\r?\n|\r/g, Strings.Empty).replace(/>\s+</g, '><');

    const bundleScriptRegex = /<script src="\/bundle.js(.*?)"><\/script>/;
    if (content.indexOf('<!-- fyord-static-render -->') >= 0) {
      content = content.replace(bundleScriptRegex, Strings.Empty);
    }

    if (content.indexOf('<!-- fyord-dynamic-render -->') < 0) {
      await this.fse.outputFile(`${this.config.outputPathRoot}/${pageName}.html`, content);
      this.addEntrySiteMap(url);
    } else {
      const bundleScript = (content.match(bundleScriptRegex) as Array<string>)[0];
      const appRootString = '<div id="app-root">';
      const closingHtml = `${appRootString}</div>${bundleScript}</body></html>`;

      let unRenderedVersion = content.split(appRootString)[0];
      unRenderedVersion = `${unRenderedVersion}${closingHtml}`;
      await this.fse.outputFile(`${this.config.outputPathRoot}/${pageName}.html`, unRenderedVersion);
      this.addEntrySiteMap(url);
    }

    return await this.getPathsForLinksOnPage(page);
  }
}
