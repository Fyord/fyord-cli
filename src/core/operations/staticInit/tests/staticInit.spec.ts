import { Strings } from 'tsbase/System/Strings';
import { Any, Mock, Times } from 'tsmockit';
import { Directories } from '../../../../enums/directories';
import { Errors } from '../../../../enums/errors';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/fileSystemExtraAdapter';
import { StaticInit } from '../staticInit';

describe('staticInit', () => {
  const mockFseAdapter = new Mock<IFileSystemExtraAdapter>();

  let updateTextInFileCalledTimes: number;
  let installWebpackShellPluginCalledTimes: number;
  let addWebpackOnBuildStartCommandCalledTimes: number;
  const fakeUpdateTextInFile = () => updateTextInFileCalledTimes++;
  const fakeInstallWebpackShellPlugin = () => installWebpackShellPluginCalledTimes++;
  const fakeAddWebpackOnBuildStartCommand = () => addWebpackOnBuildStartCommandCalledTimes++;

  let classUnderTest: StaticInit;

  beforeEach(() => {
    updateTextInFileCalledTimes = 0;
    installWebpackShellPluginCalledTimes = 0;
    addWebpackOnBuildStartCommandCalledTimes = 0;
    mockFseAdapter.Setup(f => f.pathExists(Any<string>()), false);

    classUnderTest = new StaticInit(
      mockFseAdapter.Object,
      fakeUpdateTextInFile as any,
      fakeInstallWebpackShellPlugin as any,
      fakeAddWebpackOnBuildStartCommand);
  });

  it('should return failing result when ran outside root directory', async () => {
    mockFseAdapter.Setup(f => f.pathExists(Directories.RootPackage), false);
    mockFseAdapter.Setup(f => f.pathExists(Directories.Static), false);

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain(Errors.NotInRoot);
  });

  it('should return failing result when static directory already exists', async () => {
    mockFseAdapter.Setup(f => f.pathExists(Directories.RootPackage), true);
    mockFseAdapter.Setup(f => f.pathExists(Directories.Static), true);

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain('This project is already ran the "staticInit" command.');
  });

  it('should return successful result when ran in root dir and static dir does not already exist', async () => {
    mockFseAdapter.Setup(f => f.pathExists(Directories.RootPackage), true);
    mockFseAdapter.Setup(f => f.pathExists(Directories.Static), false);
    mockFseAdapter.Setup(f => f.outputFile(Any<string>(), Any<string>()));

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeTruthy();
    mockFseAdapter.Verify(f => f.outputFile(Strings.Empty, Strings.Empty), Times.Once);
    expect(updateTextInFileCalledTimes).toEqual(1);
    expect(addWebpackOnBuildStartCommandCalledTimes).toEqual(1);
    expect(installWebpackShellPluginCalledTimes).toEqual(1);
  });
});
