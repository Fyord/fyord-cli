import { Mock } from 'tsmockit';
import { IPersister, Strings } from 'tsbase';
import { SettingsService } from '../settingsService';
import { Settings, SettingsMap } from '../settings';

describe('SettingsService', () => {
  const mockPersister = new Mock<IPersister<any>>();
  let classUnderTest: SettingsService;

  beforeEach(() => {
    spyOn(console, 'log');
    mockPersister.Setup(p => p.Retrieve(), []);
    mockPersister.Setup(p => p['filePath'], '');

    classUnderTest = SettingsService.Instance(mockPersister.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should get setting from persistence', () => {
    SettingsService.Destroy();
    const value = 'value';
    mockPersister.Setup(p => p.Retrieve(), [
      { key: Settings.BaseUrl, value: value }
    ]);
    classUnderTest = SettingsService.Instance(mockPersister.Object);

    const persistedValue = classUnderTest.GetSettingOrDefault(Settings.BaseUrl);

    expect(persistedValue).toEqual(value);
  });

  it('should get default value for setting when none persisted', () => {
    SettingsService.Destroy();
    classUnderTest = SettingsService.Instance(mockPersister.Object);

    expect(classUnderTest.GetSettingOrDefault(Settings.BaseUrl))
      .toEqual(SettingsMap.get(Settings.BaseUrl));
  });

  it('should return an empty string for setting when none persisted', () => {
    SettingsService.Destroy();
    classUnderTest = SettingsService.Instance(mockPersister.Object);

    expect(classUnderTest.GetSettingOrDefault('fake' as Settings))
      .toEqual(Strings.Empty);
  });
});
