import { AsyncCommand, Result } from 'tsbase';
import { Directories } from '../../../enums/directories';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { DIModule } from '../../../diModule';
import { Errors } from '../../../enums/errors';
import { UpdateTextInFile, updateTextInFile as _updateTextInFile } from '../../utility/module';
import { IOperation } from '../operation';
import { TsconfigTemplate } from './templates/tsconfigTemplate';

const staticTsConfig = `${Directories.Static}/tsconfig.json`;

export class StaticInit implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private updateTextInFile: UpdateTextInFile = _updateTextInFile
  ) { }

  public Execute(): Promise<Result> {
    return new AsyncCommand(async () => {
      const inRootDir = await this.fse.pathExists(Directories.RootPackage);
      const staticAlreadyExists = await this.fse.pathExists(Directories.Static);
      if (inRootDir && !staticAlreadyExists) {
        this.fse.outputFile(staticTsConfig, TsconfigTemplate);
        await this.updateTextInFile(Directories.RootPackage, '"build": "', '"build": "fyord bs && ');
        await this.updateTextInFile(Directories.RootPackage, '"start": "', '"start": "fyord bs && ');
        await this.updateTextInFile('./.gitignore', 'public', 'public\nstatic/**/*.js');
      } else {
        throw new Error(
          inRootDir ? 'This project is already ran the "staticInit" command.' : Errors.NotInRoot
        );
      }
    }).Execute();
  }
}
