import { Strings } from 'tsbase/System/Strings';
import { Any, Mock, Times } from 'tsmockit';
import { Directories } from '../../../../enums/directories';
import { Errors } from '../../../../enums/errors';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/fileSystemExtraAdapter';
import { addEsbuildCommand } from '../../../utility/addEsbuildCommand';
import { StaticInit } from '../staticInit';
import { Commands } from '../../../../enums/commands';

describe('staticInit', () => {
  const mockFseAdapter = new Mock<IFileSystemExtraAdapter>();

  let updateTextInFileCalledTimes: number;
  const fakeUpdateTextInFile = () => updateTextInFileCalledTimes++;
  let commandsAdded: string[];
  const fakeAddEsbuildCommand: typeof addEsbuildCommand = (c) => commandsAdded.push(c);

  let classUnderTest: StaticInit;

  beforeEach(() => {
    commandsAdded = [];
    updateTextInFileCalledTimes = 0;
    mockFseAdapter.Setup(f => f.pathExists(Any<string>()), false);

    classUnderTest = new StaticInit(
      mockFseAdapter.Object,
      fakeAddEsbuildCommand,
      fakeUpdateTextInFile as any);
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
    expect(commandsAdded).toContain(Commands.FyordBuildStatic);
  });
});
