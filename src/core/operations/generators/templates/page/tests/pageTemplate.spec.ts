import { Mock } from 'tsmockit';
import { Settings } from '../../../../../../settings/settings';
import { ISettingsService } from '../../../../../../settings/settingsService';
import { PageTemplate } from '../pageTemplate';

describe('PageTemplate', () => {
  const mockSettingsService = new Mock<ISettingsService>();
  mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.StyleExtension), 'css');

  beforeAll(() => {
    spyOn(console, 'log');
  });

  it('should generate template without args', () => {
    expect(PageTemplate(undefined, mockSettingsService.Object)).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(PageTemplate(['name'], mockSettingsService.Object)).toBeDefined();
  });
});
