import { AsyncCommand, Result, Strings } from 'tsbase';
import { DIModule } from '../../../diModule';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { AddImportEntryTip } from './constants';
import { IGenerator } from './iGenerator';
import { WebComponentSpecTemplate, WebComponentStylesTemplate, WebComponentTemplate } from './templates/module';
import { updateModuleExports } from './updateModuleExports';

export class WebComponentGenerator implements IGenerator {
  public Alias = 'wc';

  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private fs = DIModule.FileSystemAdapter) { }

  public async Generate(args: string[]): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      const name = args[0];
      const selector = args[1];

      if (!name || !selector) {
        throw new Error(`"name" and "selector" (2) args are required to generate a web component.
Example usage: fyord g wc className selector-name`);
      }

      const camelCaseName = Strings.CamelCase(name);

      const webComponentTemplate = WebComponentTemplate(args);
      const webComponentStylesTemplate = WebComponentStylesTemplate();
      const webComponentSpecTemplate = WebComponentSpecTemplate(args);

      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, webComponentTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.styles.ts`, webComponentStylesTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.ts`, webComponentSpecTemplate);

      await updateModuleExports(this.fse, this.fs, camelCaseName);

      console.log(AddImportEntryTip('wc', selector));
    }).Execute();
  }
}
