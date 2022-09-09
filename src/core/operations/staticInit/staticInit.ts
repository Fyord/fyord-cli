import { AsyncCommand, Result } from 'tsbase';
import { Directories } from '../../../enums/directories';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { DIModule } from '../../../diModule';
import { Commands, Errors } from '../../../enums/module';
import {
  addWebpackOnBuildStartCommand,
  installDependencyIfNotInstalled,
  UpdateTextInFile,
  updateTextInFile as _updateTextInFile
} from '../../utility/module';
import { IOperation } from '../operation';
import { TsconfigTemplate } from './templates/tsconfigTemplate';

const staticTsConfig = `${Directories.Static}/tsconfig.json`;

export class StaticInit implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private updateTextInFile: UpdateTextInFile = _updateTextInFile,
    private installWebpackShellPluginFunc = installDependencyIfNotInstalled,
    private addWebpackOnBuildStartCommandFunc = addWebpackOnBuildStartCommand
  ) { }

  public Execute(): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      const inRootDir = await this.fse.pathExists(Directories.RootPackage);
      const staticAlreadyExists = await this.fse.pathExists(Directories.Static);

      if (inRootDir && !staticAlreadyExists) {
        this.fse.outputFile(staticTsConfig, TsconfigTemplate);

        await this.installWebpackShellPluginFunc(Directories.WebpackShellPlugin, Commands.InstallWebpackShellPlugin);
        this.addWebpackOnBuildStartCommandFunc(Commands.FyordBuildStatic);

        await this.updateTextInFile(Directories.Gitignore, 'public', 'public\nstatic/**/*.js');
      } else {
        throw new Error(
          inRootDir ? 'This project is already ran the "staticInit" command.' : Errors.NotInRoot
        );
      }
    }).Execute();
  }
}
