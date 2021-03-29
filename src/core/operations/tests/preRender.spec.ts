import { Strings } from 'tsbase';
import { Mock, Times } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { Settings } from '../../../settings/settings';
import { ISettingsService } from '../../../settings/settingsService';
import { IBrowser, IPage, IPageRequest, IPuppeteer, PreRenderOperation } from '../preRender';

const mockPageRequest = new Mock<IPageRequest>();

class FakePage implements IPage {
  renderMode: 'dynamic' | 'hybrid' | 'static' = 'hybrid';

  gotoCalls = new Array<{ url: string, options: any }>();
  waitForSelectorCalls = new Array<{ selector: string, options: any }>();
  setRequestInterceptionCalls = new Array<boolean>();
  onCalls = new Array<{ event: string }>();

  async on(event: string, callback: (request: any) => void) {
    this.onCalls.push({ event });
    callback(mockPageRequest.Object);
  }
  setRequestInterception(on: boolean): void {
    this.setRequestInterceptionCalls.push(on);
  }
  async waitForSelector(selector: string, options: any): Promise<void> {
    this.waitForSelectorCalls.push({ selector, options });
  }
  async goto(url: string, options: any): Promise<void> {
    this.gotoCalls.push({ url, options });
  }
  async evaluate(callback: () => string[]): Promise<string[]> {
    console.log('got here');
    return callback();
  }
  async content(): Promise<string> {
    /* eslint-disable max-len */
    /* eslint-disable indent */
    switch (this.renderMode) {
      case 'dynamic':
        return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Routing | fyord app</title><meta name="description" content="Light-weight framework designed to embrace core competencies"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="    default-src \'self\' assets.chucknorris.host via.placeholder.com;    connect-src \'self\' api.chucknorris.io;    style-src-elem \'self\' fonts.googleapis.com;    font-src *;    upgrade-insecure-requests;"><link rel="icon" type="image/jpg" href="/images/favicon.jpg"><link href="/styles.css" rel="stylesheet"><meta name="og:image" content=""></head><body><div class="unsupported-browser"></div><div id="app-root"><div id="app-root-layout" default="true"><div id="fy-64f9544a-0bc7-420f-458b-57e77ea0011a"><header><nav class="_16oNEZrmYtIpb6ILEcszYU"><ul><li key="0"><a href="/" routed="true">Home</a></li><li key="1"><a href="/examples" routed="true">Examples</a></li><li key="2"><a href="/styleguide" routed="true">Styleguide</a></li></ul></nav></header></div><main><div id="fy-b25fbf67-7861-4e26-b48e-0b5f84dbf5a9"><div><h1>Routing</h1><p>Routing in fyord is seamless.  Simply use normal anchor tags, and local urls which aren\'t target blank will be routed on the client.</p><p>The below examples demonstrate this. Follow any of the "params" links to see how to make use of the respective parameter types.</p><ul class="list-style"><li><a href="/examples/routing/route-params/one/two" routed="true">Route Params</a></li><li><a href="/examples/routing/query-params?one=1&amp;two=2" routed="true">Query Params</a></li><li><a href="/examples/routing/hash-params#one#two" routed="true">Hash Params</a></li><li><a href="/examples/routing" target="_blank" routed="true">Target Blank</a></li><li><a href="https://duckduckgo.com/" routed="true">External Route</a></li></ul></div></div><!-- fyord-dynamic-render --></main><div id="fy-0d1d4b98-a9ac-4001-6b82-a55c4ba94ad2"><footer class="eMWRAqAhoDqWRqO7kVkWl"><h2>Footer</h2></footer></div></div></div><script src="/unsupported-browser.js"></script><script src="/bundle.js"></script></body></html>';
      case 'static':
        return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Routing | fyord app</title><meta name="description" content="Light-weight framework designed to embrace core competencies"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="    default-src \'self\' assets.chucknorris.host via.placeholder.com;    connect-src \'self\' api.chucknorris.io;    style-src-elem \'self\' fonts.googleapis.com;    font-src *;    upgrade-insecure-requests;"><link rel="icon" type="image/jpg" href="/images/favicon.jpg"><link href="/styles.css" rel="stylesheet"><meta name="og:image" content=""></head><body><div class="unsupported-browser"></div><div id="app-root"><div id="app-root-layout" default="true"><div id="fy-64f9544a-0bc7-420f-458b-57e77ea0011a"><header><nav class="_16oNEZrmYtIpb6ILEcszYU"><ul><li key="0"><a href="/" routed="true">Home</a></li><li key="1"><a href="/examples" routed="true">Examples</a></li><li key="2"><a href="/styleguide" routed="true">Styleguide</a></li></ul></nav></header></div><main><div id="fy-b25fbf67-7861-4e26-b48e-0b5f84dbf5a9"><div><h1>Routing</h1><p>Routing in fyord is seamless.  Simply use normal anchor tags, and local urls which aren\'t target blank will be routed on the client.</p><p>The below examples demonstrate this. Follow any of the "params" links to see how to make use of the respective parameter types.</p><ul class="list-style"><li><a href="/examples/routing/route-params/one/two" routed="true">Route Params</a></li><li><a href="/examples/routing/query-params?one=1&amp;two=2" routed="true">Query Params</a></li><li><a href="/examples/routing/hash-params#one#two" routed="true">Hash Params</a></li><li><a href="/examples/routing" target="_blank" routed="true">Target Blank</a></li><li><a href="https://duckduckgo.com/" routed="true">External Route</a></li></ul></div></div><!-- fyord-static-render --></main><div id="fy-0d1d4b98-a9ac-4001-6b82-a55c4ba94ad2"><footer class="eMWRAqAhoDqWRqO7kVkWl"><h2>Footer</h2></footer></div></div></div><script src="/unsupported-browser.js"></script></body></html>';
      default:
        return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Home | fyord app</title><meta name="description" content="Light-weight framework designed to embrace core competencies"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="    default-src \'self\' assets.chucknorris.host via.placeholder.com;    connect-src \'self\' api.chucknorris.io;    style-src-elem \'self\' fonts.googleapis.com;    font-src *;    upgrade-insecure-requests;"><link rel="icon" type="image/jpg" href="/images/favicon.jpg"><link href="/styles.css" rel="stylesheet"><meta name="og:image" content=""></head><body><div class="unsupported-browser"></div><div id="app-root"><div id="app-root-layout" default="true"><div id="fy-a7bb2e0d-1ae2-4a36-d61e-7cfaf35b019c"><header><nav class="_16oNEZrmYtIpb6ILEcszYU"><ul><li key="0"><a href="/" routed="true">Home</a></li><li key="1"><a href="/examples" routed="true">Examples</a></li><li key="2"><a href="/styleguide" routed="true">Styleguide</a></li></ul></nav></header></div><main><div id="fy-d18684db-3718-41f6-8598-e1adf2a62188"><div><h1>fyord</h1><p>Light-weight framework designed to embrace core competencies</p><section><h2>Core Tenants</h2><ol class="list-style"><li><span>Expert</span><ul class="list-style"><li><span>Focus on skills that transfer</span></li><li><span>For software developers</span></li><li><span>Who know Html, CSS, and JavaScript</span></li></ul></li><li><span>Professional</span><ul class="list-style"><li><span>Easy to test</span></li><li><span>Easy to debug</span></li><li><span>Fast and Secure</span></li></ul></li><li><span>Minimal</span><ul class="list-style"><li><span>Learning curve</span></li><li><span>Boilerplate</span></li><li><span>Friction</span></li></ul></li></ol><h3>Design Constraints</h3><ol class="list-style"><li><span>Serverless</span><ul class="list-style"><li><span>No features require server-side functionality outside of build / pipeline</span></li><li><span>Hosting fyord apps should only require a file server</span></li><li><span>Support build time (pipeline) pre-rendering</span></li></ul></li></ol></section><section><h2>Getting started</h2><p>Use this project as a starting point for a new <i>fyord</i> app or as living documentation for <i>fyord\'s</i> features.</p><p><a href="/examples" routed="true">See examples</a></p></section></div></div><!-- fyord-hybrid-render --></main><div id="fy-ec44f5f1-aae9-4cea-7612-94ec2b503fab"><footer class="eMWRAqAhoDqWRqO7kVkWl"><h2>Footer</h2></footer></div></div></div><script src="/unsupported-browser.js"></script><script src="/bundle.js"></script></body></html>';
    }
    /* eslint-enable indent */
    /* eslint-enable max-len */
  }
}

describe('PreRenderOperation', () => {
  let classUnderTest: PreRenderOperation;
  const mockPuppeteer = new Mock<IPuppeteer>();
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();
  const mockSettingsService = new Mock<ISettingsService>();
  const mockBrowser = new Mock<IBrowser>();
  const mockLocation = new Mock<Location>();
  const mockDocument = new Mock<Document>();
  const fakePage = new FakePage();

  beforeAll(() => {
    spyOn(console, 'log');
    spyOn(console, 'error');
    mockFileSystemExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    mockPageRequest.Setup(r => r._url, '/test?query=test#test');
    mockPageRequest.Setup(r => r.abort());
    mockPageRequest.Setup(r => r.continue());
    mockPageRequest.Setup(r => r.resourceType(), 'test');
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Strings.Empty as Settings), Strings.Empty);
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.BlockedResourceTypes), ['blocked-resource']);
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.SkippedResources), ['skipped-resource']);
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.DynamicRenderModeString), '<!-- fyord-dynamic-render -->');
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.StaticRenderModeString), '<!-- fyord-static-render -->');
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.HybridRenderModeString), '<!-- fyord-hybrid-render -->');
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.BundleScriptRegex), '<script src="/bundle.js(.*?)"></script>');
    mockPuppeteer.Setup(p => p.launch(), mockBrowser.Object);
    mockBrowser.Setup(b => b.close());
    mockBrowser.Setup(b => b.newPage(), fakePage);
    const origin = 'testOrigin';
    mockLocation.Setup(l => l.origin, origin);
    mockDocument.Setup(d => d.location, mockLocation.Object);
    mockDocument.Setup(d => d.querySelectorAll('a'), [
      { href: `${origin}/test`, pathname: '/test' }
    ]);
  });

  beforeEach(() => {
    fakePage.renderMode = 'hybrid';

    classUnderTest = new PreRenderOperation(
      mockPuppeteer.Object,
      mockFileSystemExtra.Object,
      mockSettingsService.Object,
      mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new PreRenderOperation()).toBeDefined();
  });

  const minimumFilesOutput = 4;
  it('should pre render a page using hybrid mode', async () => {
    fakePage.renderMode = 'hybrid';

    const result = await classUnderTest.Execute();

    expect(result).toBeTruthy();
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), minimumFilesOutput + 1);
  });

  it('should pre render a page using dynamic mode', async () => {
    fakePage.renderMode = 'dynamic';

    const result = await classUnderTest.Execute();

    expect(result).toBeTruthy();
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), minimumFilesOutput * 2 + 2);
  });

  it('should pre render a page using static mode', async () => {
    fakePage.renderMode = 'static';

    const result = await classUnderTest.Execute();

    expect(result).toBeTruthy();
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), minimumFilesOutput * 3 + 3);
  });

  it('should NOT pre-render external pages (links with different origin)', async () => {
    mockDocument.Setup(d => d.querySelectorAll('a'), [
      { href: 'fake/test', pathname: '/external' }
    ]);
    mockFileSystemExtra.Setup(fse => fse.outputFile('/external', Strings.Empty));

    const result = await classUnderTest.Execute();

    expect(result).toBeTruthy();
    mockFileSystemExtra.Verify(fse => fse.outputFile('/external', Strings.Empty), minimumFilesOutput);
  });

  it('should abort page request on skipped resource', async () => {
    mockPageRequest.Setup(r => r._url, 'skipped-resource');

    const result = await classUnderTest.Execute();

    expect(result).toBeTruthy();
    mockPageRequest.Verify(r => r.abort(), Times.Once);
  });

  it('should abort page request on blocked resource', async () => {
    mockPageRequest.Setup(r => r.resourceType(), 'blocked-resource');

    const result = await classUnderTest.Execute();

    expect(result).toBeTruthy();
    mockPageRequest.Verify(r => r.abort(), 2);
  });
});
