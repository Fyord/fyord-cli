import { AsyncCommand, Result } from 'tsbase';
import { DIModule } from '../../../diModule';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IGenerator } from './iGenerator';
import { DebugTemplate } from './templates/debugTemplate';

export class DebugGenerator implements IGenerator {
  public Alias = 'db';

  constructor(private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter) { }

  public async Generate(): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      await this.fse.outputFile('.vscode/launch.json', DebugTemplate());
    }).Execute();
  }
}
