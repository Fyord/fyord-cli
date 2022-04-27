import { Strings } from 'tsbase';
import { Mock, Times } from 'tsmockit';
import { Directories } from '../../../enums/directories';
import { Errors } from '../../../enums/module';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { WasmInit } from './wasmInit';

describe('WasmInit', () => {
  let classUnderTest: WasmInit;
  const mockFsExtra = new Mock<IFileSystemExtraAdapter>();

  let updateTextInFileCalledTimes: number;
  let installDependencyCalledTimes: number;
  let addWebpackOnBuildCalledTimes: number;

  beforeEach(() => {
    updateTextInFileCalledTimes = 0;
    installDependencyCalledTimes = 0;
    addWebpackOnBuildCalledTimes = 0;

    mockFsExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    mockFsExtra.Setup(fse => fse.pathExists(Strings.Empty), false);
    mockFsExtra.Setup(fse => fse.pathExists(Directories.CargoLock), false);
    mockFsExtra.Setup(fse => fse.pathExists(Directories.RootPackage), false);

    classUnderTest = new WasmInit(
      mockFsExtra.Object,
      () => Promise.resolve().then(() => { updateTextInFileCalledTimes++; }),
      () => Promise.resolve().then(() => { installDependencyCalledTimes++; }),
      () => Promise.resolve().then(() => { addWebpackOnBuildCalledTimes++; })
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new WasmInit()).toBeDefined();
  });

  it('should fail when executed in a directory WITHOUT a package.json or Cargo.lock', async () => {
    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain(Errors.NotInRoot);
    mockFsExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), Times.Never);
  });

  it('should fail when executed in a directory WITHOUT a package.json AND Cargo.lock', async () => {
    mockFsExtra.Setup(fse => fse.pathExists(Directories.CargoLock), true);

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain(Errors.WasmInitAlreadyRan);
    mockFsExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), Times.Never);
  });

  it('should succeed when executed in a directory WITH a package.json and NO Cargo.lock', async () => {
    mockFsExtra.Setup(fse => fse.pathExists(Directories.RootPackage), true);

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeTruthy();
    expect(updateTextInFileCalledTimes).toEqual(4);
    expect(installDependencyCalledTimes).toEqual(2);
    expect(addWebpackOnBuildCalledTimes).toEqual(1);
    mockFsExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 6);
  });
});
