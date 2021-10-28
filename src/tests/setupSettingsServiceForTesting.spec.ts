import { Mock } from 'tsmockit';
import { IPersister } from 'tsbase';
import { ISettingsService, SettingsService } from '../settings/settingsService';

export const setupSettingsServiceForTesting = (): ISettingsService => {
  const mockPersister = new Mock<IPersister<any>>();
  mockPersister.Setup(p => p.Retrieve(), []);
  mockPersister.Setup(p => p['filePath'], '');

  return SettingsService.Instance(mockPersister.Object);
};
