import { AsyncCommand, Result } from 'tsbase';
import { Directories } from '../../../enums/directories';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { DIModule } from '../../../diModule';
import { Commands, Errors } from '../../../enums/module';
import {
  UpdateTextInFile,
  updateTextInFile as _updateTextInFile,
  addEsbuildCommand as _addEsbuildOnStartCommand,
  EsbuildTypes
} from '../../utility/module';
import { IOperation } from '../operation';
import { TsconfigTemplate } from './templates/tsconfigTemplate';

const staticTsConfig = `${Directories.Static}/tsconfig.json`;

export class StaticInit implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private addEsbuildOnStartCommand = _addEsbuildOnStartCommand,
    private updateTextInFile: UpdateTextInFile = _updateTextInFile
  ) { }

  public Execute(): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      const inRootDir = await this.fse.pathExists(Directories.RootPackage);
      const staticAlreadyExists = await this.fse.pathExists(Directories.Static);

      if (inRootDir && !staticAlreadyExists) {
        this.fse.outputFile(staticTsConfig, TsconfigTemplate);

        this.addEsbuildOnStartCommand(Commands.FyordBuildStatic, EsbuildTypes.Before);

        await this.updateTextInFile(Directories.Gitignore, 'public', 'public\nstatic/**/*.js');
      } else {
        throw new Error(
          inRootDir ? 'This project is already ran the "staticInit" command.' : Errors.NotInRoot
        );
      }
    }).Execute();
  }
}
