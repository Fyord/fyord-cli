import { Strings } from 'tsbase';
import { Mock, Times } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { UpdateTextInFile } from '../../utility/updateTextInFile';
import { WasmInit } from './wasmInit';

describe('WasmInit', () => {
  let classUnderTest: WasmInit;
  const mockFsExtra = new Mock<IFileSystemExtraAdapter>();
  const mockChildProcess = new Mock<any>();

  let updateTextInFileCalledCount = 0;
  const fakeUpdateTextInFile: UpdateTextInFile = async (
    _fileName: string,
    _oldText: string,
    _newText: string
  ): Promise<void> => { updateTextInFileCalledCount++; };

  beforeEach(() => {
    mockFsExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    mockChildProcess.Setup(cp => cp.execSync(Strings.Empty));

    classUnderTest = new WasmInit(
      mockFsExtra.Object,
      mockChildProcess.Object,
      fakeUpdateTextInFile);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new WasmInit()).toBeDefined();
  });

  it('should fail when executed in a directory WITHOUT a package.json', async () => {
    mockFsExtra.Setup(fse => fse.pathExists(Strings.Empty), false);

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
    mockFsExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), Times.Never);
  });

  it('should succeed when executed in a directory WITH a package.json', async () => {
    mockFsExtra.Setup(fse => fse.pathExists(Strings.Empty), true);

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeTruthy();
    mockFsExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 5);
  });
});
