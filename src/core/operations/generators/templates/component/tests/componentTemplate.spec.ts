import { Mock } from 'tsmockit';
import { Settings } from '../../../../../../settings/settings';
import { ISettingsService } from '../../../../../../settings/settingsService';
import { ComponentTemplate } from '../componentTemplate';
import { setupSettingsServiceForTests } from '../../../../../../setupSettingsServiceForTests';

describe('ComponentTemplate', () => {
  const mockSettingsService = new Mock<ISettingsService>();
  mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.StyleExtension), 'css');

  it('should run with default args', () => {
    setupSettingsServiceForTests();
    expect(ComponentTemplate()).toBeDefined();
  });

  it('should generate template without args', () => {
    expect(ComponentTemplate(undefined, mockSettingsService.Object)).toBeDefined();
  });

  it('should generate template with just name arg', () => {
    const templateValue = ComponentTemplate(['name'], mockSettingsService.Object);

    expect(templateValue).toBeDefined();
    expect(templateValue.includes('Props')).toBeFalsy();
  });

  it('should generate template with name and props args', () => {
    const templateValue = ComponentTemplate(['name', 'props'], mockSettingsService.Object);

    expect(templateValue).toBeDefined();
    expect(templateValue.includes('Props')).toBeTruthy();
  });
});
