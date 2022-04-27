import { DIModule } from '../../diModule';
import { Directories, Commands } from '../../enums/module';
import { IFileSystemExtraAdapter } from '../../fileSystem/fileSystemExtraAdapter';

export const installDependencyIfNotInstalled = async (
  nodeModulePath: Directories,
  installCommand: Commands,
  fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
  cp = DIModule.ChildProcess
): Promise<void> => {
  const alreadyInstalled = await fse.pathExists(nodeModulePath);
  if (!alreadyInstalled) {
    cp.execSync(installCommand);
  } else {
    console.log(`Skipping "${installCommand}" as "${nodeModulePath}" already exists.`);
  }
};
