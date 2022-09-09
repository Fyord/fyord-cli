import { Strings } from 'tsbase/System/Strings';
import { Any, Mock, Times } from 'tsmockit';
import { DIModule } from '../../../diModule';
import { Directories } from '../../../enums/directories';
import { Errors } from '../../../enums/errors';
import { ChildProcessAdapter } from '../../../fileSystem/childProcessAdapter';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { BuildStaticOperation } from '../buildStatic';

describe('BuildStatic', () => {
  const mockChildProcess = new Mock<ChildProcessAdapter>();
  const mockFileSystemExtraAdapter = new Mock<IFileSystemExtraAdapter>();
  const mockFileSystemAdapter = new Mock<typeof DIModule['FileSystemAdapter']>();
  const mockProcess = new Mock<NodeJS.Process>();
  let classUnderTest: BuildStaticOperation;
  let fakeGetAllFilesResponse: string[];
  const fakeGetAllFilesFunc = () => fakeGetAllFilesResponse;
  let fakeImportResponse: any;
  const fakeImportFunc = () => fakeImportResponse;

  beforeEach(() => {
    fakeGetAllFilesResponse = [];

    mockFileSystemExtraAdapter.Setup(f => f.pathExists(Any<string>()), false);
    mockChildProcess.Setup(cp => cp.execSync(Any<string>()));
    mockProcess.Setup(p => p.cwd(), Any<string>());

    classUnderTest = new BuildStaticOperation(
      mockChildProcess.Object,
      mockFileSystemExtraAdapter.Object,
      mockFileSystemAdapter.Object,
      mockProcess.Object,
      fakeGetAllFilesFunc as any,
      fakeImportFunc);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return true and log warning when no static tsconfig file found', async () => {
    const consoleSpy = spyOn(console, 'warn');

    const result = await classUnderTest.Execute([]);

    expect(result.IsSuccess).toBeTruthy();
    expect(consoleSpy).toHaveBeenCalledWith(`"${Directories.Static}/tsconfig.json" not found. Aborting operation.\n${Errors.NotInRoot}`);
  });

  it('should return false when type of default import is not function', async () => {
    mockFileSystemExtraAdapter.Setup(f => f.pathExists(Any<string>()), true);
    fakeGetAllFilesResponse = ['test.json.ts', 'test.json.js'];
    fakeImportResponse = 'test';

    const result = await classUnderTest.Execute([]);

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages.length).toEqual(1);
    expect(result.ErrorMessages[0]).toContain('does not export a "default" function.');
  });

  it('should return true and output/remove files when type of default import is function', async () => {
    mockFileSystemExtraAdapter.Setup(f => f.outputFile(Any<string>(), Any<string>()));
    mockFileSystemExtraAdapter.Setup(f => f.pathExists(Any<string>()), true);
    mockFileSystemAdapter.Setup(f => f.rmSync(Any<string>()));
    fakeGetAllFilesResponse = ['test.json.ts', 'test.json.js'];
    fakeImportResponse = { default: () => 'test' };

    const result = await classUnderTest.Execute([]);

    expect(result.IsSuccess).toBeTruthy();
    mockFileSystemExtraAdapter.Verify(f => f.outputFile(Strings.Empty, Strings.Empty), Times.Once);
    mockFileSystemAdapter.Verify(f => f.rmSync(Strings.Empty), Times.Once);
  });
});
