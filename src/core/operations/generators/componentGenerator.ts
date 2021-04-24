import { AsyncCommand, IFileSystemAdapter, Result, Strings } from 'tsbase';
import { FileSystemAdapter, FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IGenerator } from './generators';
import { ComponentSpecTemplate, ComponentTemplate, CssModuleTemplate } from './templates/module';
import { updateModuleExports } from './updateModuleExports';

export class ComponentGenerator implements IGenerator {
  public Alias = 'c';

  constructor(
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    private fs: IFileSystemAdapter = FileSystemAdapter) { }

  public async Generate(args: string[]): Promise<Result> {
    return new AsyncCommand(async () => {
      const name = args[0];
      const camelCaseName = Strings.CamelCase(name);

      const componentTemplate = ComponentTemplate(args);
      const cssModuleTemplate = CssModuleTemplate(args);
      const componentSpecTemplate = ComponentSpecTemplate(args);

      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, componentTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.module.scss`, cssModuleTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.tsx`, componentSpecTemplate);

      await updateModuleExports(this.fse, this.fs, camelCaseName);
    }).Execute();
  }
}
