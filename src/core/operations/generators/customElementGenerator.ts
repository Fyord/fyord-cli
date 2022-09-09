import { Settings, ISettingsService, SettingsService } from '../../../settings/module';
import { AsyncCommand, Result, Strings } from 'tsbase';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { DIModule } from '../../../diModule';
import { IGenerator } from './iGenerator';
import { CssModuleTemplate, CustomElementSpecTemplate, CustomElementTemplate } from './templates/module';
import { updateModuleExports } from './updateModuleExports';
import { AddImportEntryTip } from './constants';

export class CustomElementGenerator implements IGenerator {
  public Alias = 'ce';

  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private fs = DIModule.FileSystemAdapter,
    private settingsService: ISettingsService = SettingsService.Instance()) { }

  public async Generate(args: string[]): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      const preferredStyleExtension = this.settingsService.GetSettingOrDefault(Settings.StyleExtension);

      const name = args[0];
      const selector = args[1];

      if (!name || !selector) {
        throw new Error(`"name" and "selector" (2) args are required to generate a custom element.
Example usage: fyord g ce className selector-name`);
      }

      const camelCaseName = Strings.CamelCase(name);

      const customElementTemplate = CustomElementTemplate(args, this.settingsService);
      const cssModuleTemplate = CssModuleTemplate();
      const customElementSpecTemplate = CustomElementSpecTemplate(args);

      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, customElementTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.module.${preferredStyleExtension}`, cssModuleTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.ts`, customElementSpecTemplate);

      await updateModuleExports(this.fse, this.fs, camelCaseName);

      console.log(AddImportEntryTip('ce', selector));
    }).Execute();
  }
}
