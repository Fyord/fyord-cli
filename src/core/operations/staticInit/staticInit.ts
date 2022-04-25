import { AsyncCommand, Result } from 'tsbase';
import { Directories } from '../../../enums/directories';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IOperation } from '../operation';
import { DIModule } from '../../../diModule';
import { Errors } from '../../../enums/errors';

export class StaticInit implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter
  ) { }

  public Execute(): Promise<Result> {
    return new AsyncCommand(async () => {
      const inRootDir = await this.fse.pathExists(Directories.RootPackage);
      const staticAlreadyExists = await this.fse.pathExists(Directories.Static);
      if (inRootDir && !staticAlreadyExists) {
        console.log('test...');
      } else {
        throw new Error(
          inRootDir ? 'This project is already ran the "staticInit" command.' : Errors.NotInRoot
        );
      }
    }).Execute();
  }
}
