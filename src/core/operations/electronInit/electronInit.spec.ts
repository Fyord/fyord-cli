import { Mock } from 'tsmockit';
import { DIModule } from '../../../diModule';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IOperation } from '../operation';
import { ElectronInitOperation } from './electronInit';

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

  let classUnderTest: IOperation;

  beforeEach(() => {
    dependencyDirectories = [];
    dependencyCommands = [];

    classUnderTest = new ElectronInitOperation(mockFse.Object, fakeInstallDependencyFunc, fakeUpdateTextInFileFunc, mockFs.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new ElectronInitOperation()).toBeDefined();
  });
});
