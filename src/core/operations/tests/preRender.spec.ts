import { Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { Settings } from '../../../settings/settings';
import { ISettingsService } from '../../../settings/settingsService';
import { IBrowser, IPage, IPuppeteer, PreRenderOperation } from '../preRender';

describe('PreRenderOperation', () => {
  let classUnderTest: PreRenderOperation;
  const mockPuppeteer = new Mock<IPuppeteer>();
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();
  const mockSettingsService = new Mock<ISettingsService>();
  const mockBrowser = new Mock<IBrowser>();
  const mockPage = new Mock<IPage>();

  beforeAll(() => {
    spyOn(console, 'log');
    spyOn(console, 'error');
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Strings.Empty as Settings), Strings.Empty);
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.BlockedResourceTypes), []);
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.SkippedResources), []);
    mockPuppeteer.Setup(p => p.launch(), mockBrowser.Object);
    mockBrowser.Setup(b => b.close());
    mockBrowser.Setup(b => b.newPage(), mockPage.Object);
    mockPage.Setup(p => p.content(), Strings.Empty);
    mockPage.Setup(p => p.evaluate(() => null), [Strings.Empty]);
    mockPage.Setup(p => p.goto(Strings.Empty, {}));
    mockPage.Setup(p => p.on(Strings.Empty, ({ }) => null));
    mockPage.Setup(p => p.setRequestInterception(true));
    mockPage.Setup(p => p.waitForSelector(Strings.Empty, {}));
  });

  beforeEach(() => {
    classUnderTest = new PreRenderOperation(
      mockPuppeteer.Object,
      mockFileSystemExtra.Object,
      mockSettingsService.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new PreRenderOperation()).toBeDefined();
  });

  it('should return a successful result on execute', () => {
    const result = classUnderTest.Execute();
    expect(result.IsSuccess).toBeTruthy();
  });
});
