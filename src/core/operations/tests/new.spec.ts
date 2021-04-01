import { Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { NewOperation } from '../new';

describe('NewOperation', () => {
  let classUnderTest: NewOperation;
  const mockFsExtra = new Mock<IFileSystemExtraAdapter>();
  const mockFs = new Mock<any>();
  const mockChildProcess = new Mock<any>();

  beforeEach(() => {
    mockFsExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    mockFsExtra.Setup(fse => fse.pathExists(Strings.Empty), false);
    mockFs.Setup(fs => fs.rmdirSync(Strings.Empty, {}));
    mockFs.Setup(fs => fs.readFileSync(Strings.Empty, 'utf8'), Buffer.from(Strings.Empty, 'utf8'));
    mockChildProcess.Setup(cp => cp.execSync(Strings.Empty));

    classUnderTest = new NewOperation(
      mockFsExtra.Object,
      mockFs.Object,
      mockChildProcess.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new NewOperation()).toBeDefined();
  });

  it('should execute without args', async () => {
    const result = await classUnderTest.Execute([]);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should execute with args and create the appropriate files when name replacement files do NOT exist', async () => {
    const result = await classUnderTest.Execute(['app']);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should execute with args and create the appropriate files when name replacement files DO exist', async () => {
    mockFsExtra.Setup(fse => fse.pathExists(Strings.Empty), true);
    const result = await classUnderTest.Execute(['app']);
    expect(result.IsSuccess).toBeTruthy();
  });
});
