import { Strings } from 'tsbase';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { SingletonSpecTemplate, SingletonTemplate } from './templates/module';
import { IGenerator } from './generators';

export class SingletonGenerator implements IGenerator {
  constructor(private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter) { }

  public async Generate(args: string[]): Promise<void> {
    const camelCaseName = Strings.CamelCase(args[0]);

    const singletonTemplate = SingletonTemplate(args);
    const singletonSpecTemplate = SingletonSpecTemplate(args);

    await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.ts`, singletonTemplate);
    await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.ts`, singletonSpecTemplate);
  }
}
