import { Mock } from 'tsmockit';
import { Settings } from '../../../../../../settings/settings';
import { ISettingsService } from '../../../../../../settings/settingsService';
import { ComponentTemplate } from '../componentTemplate';

describe('ComponentTemplate', () => {
  const mockSettingsService = new Mock<ISettingsService>();
  mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.StyleExtension), 'css');

  it('should generate template without args', () => {
    expect(ComponentTemplate(undefined, mockSettingsService.Object)).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(ComponentTemplate(['name'], mockSettingsService.Object)).toBeDefined();
  });
});
