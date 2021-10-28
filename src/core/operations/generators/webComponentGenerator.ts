import { AsyncCommand, IFileSystemAdapter, Result, Strings } from 'tsbase';
import { FileSystemAdapter, FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IGenerator } from './iGenerator';
import { WebComponentSpecTemplate, WebComponentStylesTemplate, WebComponentTemplate } from './templates/module';
import { updateModuleExports } from './updateModuleExports';

export class WebComponentGenerator implements IGenerator {
  public Alias = 'wc';

  constructor(
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    private fs: IFileSystemAdapter = FileSystemAdapter) { }

  public async Generate(args: string[]): Promise<Result> {
    return new AsyncCommand(async () => {
      const name = args[0];
      const selector = args[1];

      if (!name || !selector) {
        throw new Error(`"name" and "selector" (2) args are required to generate a web component.
Example usage: fyord g wc className selector-name`);
      }

      const camelCaseName = Strings.CamelCase(name);

      const webComponentTemplate = WebComponentTemplate(args);
      const webComponentStylesTemplate = WebComponentStylesTemplate(args);
      const webComponentSpecTemplate = WebComponentSpecTemplate(args);

      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, webComponentTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.styles.ts`, webComponentStylesTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.ts`, webComponentSpecTemplate);

      await updateModuleExports(this.fse, this.fs, camelCaseName);
    }).Execute();
  }
}
