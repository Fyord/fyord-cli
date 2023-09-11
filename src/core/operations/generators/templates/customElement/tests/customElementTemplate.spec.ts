import { Mock } from 'tsmockit';
import { Settings } from '../../../../../../settings/settings';
import { ISettingsService } from '../../../../../../settings/settingsService';
import { setupSettingsServiceForTests } from '../../../../../../setupSettingsServiceForTests';
import { CustomElementTemplate } from '../customElementTemplate';

describe('CustomElementTemplate', () => {
  const mockSettingsService = new Mock<ISettingsService>();
  mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.StyleExtension), 'css');

  beforeAll(() => {
    jest.spyOn(console, 'log');
  });

  it('should run with default args', () => {
    setupSettingsServiceForTests();
    expect(CustomElementTemplate()).toBeDefined();
  });

  it('should generate template without args', () => {
    expect(CustomElementTemplate(undefined, mockSettingsService.Object)).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(CustomElementTemplate(['name', 'selector'], mockSettingsService.Object)).toBeDefined();
  });
});
