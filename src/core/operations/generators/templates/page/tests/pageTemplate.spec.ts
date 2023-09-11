import { Mock } from 'tsmockit';
import { Settings } from '../../../../../../settings/settings';
import { ISettingsService } from '../../../../../../settings/settingsService';
import { setupSettingsServiceForTests } from '../../../../../../setupSettingsServiceForTests';
import { PageTemplate } from '../pageTemplate';

describe('PageTemplate', () => {
  const mockSettingsService = new Mock<ISettingsService>();
  mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.StyleExtension), 'css');

  beforeAll(() => {
    jest.spyOn(console, 'log');
  });

  it('should run with default args', () => {
    setupSettingsServiceForTests();
    expect(PageTemplate()).toBeDefined();
  });

  it('should generate template without args', () => {
    expect(PageTemplate(undefined, mockSettingsService.Object)).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(PageTemplate(['name'], mockSettingsService.Object)).toBeDefined();
  });
});
