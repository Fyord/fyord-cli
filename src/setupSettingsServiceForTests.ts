import { IPersister } from 'tsbase';
import { Mock } from 'tsmockit';
import { SettingsService } from './settings/settingsService';

export const setupSettingsServiceForTests = () => {
  SettingsService.Destroy();
  const mockPersister = new Mock<IPersister<any>>();
  mockPersister.Setup(p => p.Retrieve(), []);
  mockPersister.Setup(p => p['filePath'], '');
  SettingsService.Instance(mockPersister.Object);
};
