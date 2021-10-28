import { Settings, ISettingsService, SettingsService } from '../../../settings/module';
import { AsyncCommand, IFileSystemAdapter, Result, Strings } from 'tsbase';
import { FileSystemAdapter, FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IGenerator } from './generators';
import { CssModuleTemplate, CustomElementSpecTemplate, CustomElementTemplate } from './templates/module';
import { updateModuleExports } from './updateModuleExports';

export class CustomElementGenerator implements IGenerator {
  public Alias = 'ce';

  constructor(
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    private fs: IFileSystemAdapter = FileSystemAdapter,
    private settingsService: ISettingsService = SettingsService.Instance()) { }

  public async Generate(args: string[]): Promise<Result> {
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
      const cssModuleTemplate = CssModuleTemplate(args);
      const customElementSpecTemplate = CustomElementSpecTemplate(args);

      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, customElementTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.module.${preferredStyleExtension}`, cssModuleTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.ts`, customElementSpecTemplate);

      await updateModuleExports(this.fse, this.fs, camelCaseName);
    }).Execute();
  }
}
