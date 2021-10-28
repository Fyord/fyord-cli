import { IPersister, Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/module';
import { SettingsService } from '../../../../settings/settingsService';

(() => {
  SettingsService.Destroy();
  const mockPersister = new Mock<IPersister<any>>();
  mockPersister.Setup(p => p.Retrieve(), []);
  mockPersister.Setup(p => p['filePath'], '');
  SettingsService.Instance(mockPersister.Object);
})();

import { DebugGenerator } from '../debugGenerator';

describe('DebugGenerator', () => {
  let classUnderTest: DebugGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();

  beforeEach(() => {
    mockFileSystemExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    classUnderTest = new DebugGenerator(mockFileSystemExtra.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new DebugGenerator()).toBeDefined();
  });


  it('should generate debug launch file', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), true);

    const result = await classUnderTest.Generate();

    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 1);
    expect(result.IsSuccess).toBeTruthy();
  });
});
