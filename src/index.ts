const puppeteer = require('puppeteer');
const fse = require('fs-extra');

const config = {
  baseUrl: 'http://localhost:4200',
  outputPathRoot: 'public/pre-render',
  blockedResourceTypes: [
    'image', 'media', 'font'
  ],
  skippedResources: [
    'google', 'paypal', 'gstatic'
  ],
  renderModes: {
    dynamic: '<!-- fyord-dynamic-render -->',
    static: '<!-- fyord-static-render -->',
    hybrid: '<!-- fyord-hybrid-render -->'
  },
  bundleScriptRegex: /<script src="\/bundle.js(.*?)"><\/script>/,
  unsupportedBrowserScript: '<script src="/unsupported-browser.js"></script>'
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
  const pageName = route === '' ? 'index' : route;
  const url = `${config.baseUrl}${route}`;

  // eslint-disable-next-line no-console
  console.log(`| ========= Attempting to crawl: ${pageName} ========= |`);

  await page.goto(url, { waitUntil: 'networkidle2' });

  let content = await page.content();
  content = content.replace(/\r?\n|\r/g, '').replace(/>\s+</g, '><');

  if (content.indexOf(config.renderModes.static) >= 0) {
    content = content.replace(config.bundleScriptRegex, '');
  }

  if (content.indexOf(config.renderModes.dynamic) < 0) {
    await fse.outputFile(`${config.outputPathRoot}/${pageName}.html`, content);
    addEntrySiteMap(url);
  } else {
    const bundleScript = content.match(config.bundleScriptRegex)[0] || '';
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

  let xmlContent = '';
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

  const pagesToCrawl = [''];
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
      errors.push({ page: pageToCrawl, error: error });
    }

    if (pageToCrawl) {
      crawledPages.push(pageToCrawl);
    }
  }

  await fse.outputFile(`${config.outputPathRoot}/sitemap.json`, JSON.stringify({ urlset: siteMap }));
  await fse.outputFile(`${config.outputPathRoot}/sitemap.xml`, getXmlSiteMap());
  await fse.outputFile(`${config.outputPathRoot}/errors.json`, JSON.stringify(errors));

  // eslint-disable-next-line no-console
  console.log(`Completed crawling ${crawledPages.length} pages with ${errors.length} errors.`);

  await browser.close();
})();
