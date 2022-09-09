import { Strings } from 'tsbase';
import { Any, Mock } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/module';
import { setupSettingsServiceForTests } from '../../../../setupSettingsServiceForTests';

setupSettingsServiceForTests();

import { DebugGenerator } from '../debugGenerator';

describe('DebugGenerator', () => {
  let classUnderTest: DebugGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();

  beforeEach(() => {
    mockFileSystemExtra.Setup(fse => fse.outputFile(Any<string>(), Any<string>()));
    classUnderTest = new DebugGenerator(mockFileSystemExtra.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new DebugGenerator()).toBeDefined();
  });


  it('should generate debug launch file', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Any<string>()), true);

    const result = await classUnderTest.Generate();

    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 1);
    expect(result.IsSuccess).toBeTruthy();
  });
});
