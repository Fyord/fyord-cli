import { Any, Mock, Times } from 'tsmockit';
import { DIModule } from '../../../diModule';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { addEsbuildCommand } from '../../utility/addEsbuildCommand';
import { IOperation } from '../operation';
import { ElectronInitOperation } from './electronInit';
import { ElectronMain } from './templates/electronMain';
import { ElectronPreload } from './templates/electronPreload';
import { ElectronRenderer } from './templates/electronRenderer';
import { Routes } from './templates/routes';

describe('ElectronInitOperation', () => {
  const mockFse = new Mock<IFileSystemExtraAdapter>();
  const mockFs = new Mock<typeof DIModule.FileSystemAdapter>();

  let dependencyDirectories: string[];
  let dependencyCommands: string[];
  const fakeInstallDependencyFunc = async (dir: string, com: string) => {
    dependencyDirectories.push(dir);
    dependencyCommands.push(com);
  };

  let replacementFilePaths: string[];
  let replacementOldValues: string[];
  let replacementNewValues: string[];
  const fakeUpdateTextInFileFunc = async (filePath: string, oldValue, newValue: string) => {
    replacementFilePaths.push(filePath);
    replacementOldValues.push(oldValue);
    replacementNewValues.push(newValue);
  };
  let commandsAdded: string[];
  const fakeAddEsbuildCommand: typeof addEsbuildCommand = (c) => commandsAdded.push(c);

  let classUnderTest: IOperation;

  beforeEach(() => {
    commandsAdded = [];
    dependencyDirectories = [];
    dependencyCommands = [];
    replacementFilePaths = [];
    replacementOldValues = [];
    replacementNewValues = [];

    classUnderTest = new ElectronInitOperation(
      mockFse.Object,
      fakeInstallDependencyFunc,
      fakeUpdateTextInFileFunc,
      mockFs.Object,
      fakeAddEsbuildCommand
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new ElectronInitOperation()).toBeDefined();
  });

  it('should return a failing result on any error', async () => {
    const result = await classUnderTest.Execute([]);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should NOT make any changes when not in the root directory', async () => {
    mockFse.SetupOnce(f => f.pathExists(Any<string>()), false);
    const result = await classUnderTest.Execute([]);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should make changes to support electron when in the root directory', async () => {
    mockFse.SetupOnce(f => f.pathExists(Any<string>()), true);
    mockFse.Setup(f => f.outputFile(Any<string>(), ElectronMain));
    mockFse.Setup(f => f.outputFile(Any<string>(), ElectronPreload));
    mockFse.Setup(f => f.outputFile(Any<string>(), ElectronRenderer));
    mockFse.Setup(f => f.outputFile(Any<string>(), Routes));
    mockFs.SetupOnce(f => f.rmSync(Any<string>()));

    const result = await classUnderTest.Execute([]);

    expect(replacementFilePaths.length).toEqual(15);
    expect(replacementOldValues.length).toEqual(15);
    expect(replacementNewValues.length).toEqual(15);
    mockFse.Verify(f => f.outputFile(Any<string>(), ElectronMain), Times.Once);
    mockFse.Verify(f => f.outputFile(Any<string>(), ElectronPreload), Times.Once);
    mockFse.Verify(f => f.outputFile(Any<string>(), ElectronRenderer), Times.Once);
    mockFse.Verify(f => f.outputFile(Any<string>(), Routes), Times.Once);
    expect(result.IsSuccess).toBeTruthy();
  });
});
