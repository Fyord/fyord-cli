import { AsyncCommand, Result } from 'tsbase';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IGenerator } from './generators';
import { DebugTemplate } from './templates/debugTemplate';

export class DebugGenerator implements IGenerator {
  public Alias = 'db';

  constructor(private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter) { }

  public async Generate(): Promise<Result> {
    return new AsyncCommand(async () => {
      await this.fse.outputFile('.vscode/launch.json', DebugTemplate());
    }).Execute();
  }
}
