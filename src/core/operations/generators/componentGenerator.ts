import { Settings, ISettingsService, SettingsService } from '../../../settings/module';
import { AsyncCommand, IFileSystemAdapter, Result, Strings } from 'tsbase';
import { FileSystemAdapter, FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IGenerator } from './iGenerator';
import { ComponentSpecTemplate, ComponentTemplate, CssModuleTemplate } from './templates/module';
import { updateModuleExports } from './updateModuleExports';

export class ComponentGenerator implements IGenerator {
  public Alias = 'c';

  constructor(
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    private fs: IFileSystemAdapter = FileSystemAdapter,
    private settingsService: ISettingsService = SettingsService.Instance()) { }

  public async Generate(args: string[]): Promise<Result> {
    return new AsyncCommand(async () => {
      const preferredStyleExtension = this.settingsService.GetSettingOrDefault(Settings.StyleExtension);

      const name = args[0];
      const camelCaseName = Strings.CamelCase(name);

      const componentTemplate = ComponentTemplate(args, this.settingsService);
      const cssModuleTemplate = CssModuleTemplate();
      const componentSpecTemplate = ComponentSpecTemplate(args);

      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, componentTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.module.${preferredStyleExtension}`, cssModuleTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.tsx`, componentSpecTemplate);

      await updateModuleExports(this.fse, this.fs, camelCaseName);
    }).Execute();
  }
}
