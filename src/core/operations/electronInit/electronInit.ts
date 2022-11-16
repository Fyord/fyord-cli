import { AsyncCommand, Result } from 'tsbase';
import { DIModule } from '../../../diModule';
import { Commands, Directories } from '../../../enums/module';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { installDependencyIfNotInstalled } from '../../utility/module';
import { IOperation } from '../operation';

export class ElectronInitOperation implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private installDependencyIfNotInstalledFunc = installDependencyIfNotInstalled
  ) { }

  public Execute(): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      const inRootDir = await this.fse.pathExists(Directories.RootPackage);

      if (inRootDir) {
        await this.installDependencyIfNotInstalledFunc(Directories.WebpackShellPlugin, Commands.InstallWebpackShellPlugin);
        await this.installDependencyIfNotInstalledFunc(Directories.WebpackShellPlugin, Commands.InstallElectron);
        await this.installDependencyIfNotInstalledFunc(Directories.WebpackShellPlugin, Commands.InstallElectronPackager);
      }
    }).Execute();
  }
}
