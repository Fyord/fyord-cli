import { IFileSystemAdapter, Strings } from 'tsbase';
import { FileSystemAdapter, FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { SingletonSpecTemplate, SingletonTemplate } from './templates/module';
import { IGenerator } from './generators';
import { updateModuleExports } from './updateModuleExports';

export class SingletonGenerator implements IGenerator {
  public Alias = 's';

  constructor(
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    private fs: IFileSystemAdapter = FileSystemAdapter) { }

  public async Generate(args: string[]): Promise<void> {
    const name = args[0];
    const camelCaseName = Strings.CamelCase(name);

    const singletonTemplate = SingletonTemplate(args);
    const singletonSpecTemplate = SingletonSpecTemplate(args);

    await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.ts`, singletonTemplate);
    await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.ts`, singletonSpecTemplate);

    await updateModuleExports(this.fse, this.fs, Strings.PascalCase(name), camelCaseName);
  }
}
