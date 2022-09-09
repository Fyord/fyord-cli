import { AsyncCommand, Result, Strings } from 'tsbase';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { PageTemplate, CssModuleTemplate, PageSpecTemplate } from './templates/module';
import { ISettingsService, Settings, SettingsService } from '../../../settings/module';
import { IGenerator } from './iGenerator';
import { DIModule } from '../../../diModule';

export class PageGenerator implements IGenerator {
  public Alias = 'p';

  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private fs = DIModule.FileSystemAdapter,
    private settingsService: ISettingsService = SettingsService.Instance()) { }

  public async Generate(args: string[]): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      const preferredStyleExtension = this.settingsService.GetSettingOrDefault(Settings.StyleExtension);

      const name = args[0];
      const camelCaseName = Strings.CamelCase(name);
      const pascalCaseName = Strings.PascalCase(name);

      const pageTemplate = PageTemplate(args, this.settingsService);
      const cssModuleTemplate = CssModuleTemplate();
      const pageSpecTemplate = PageSpecTemplate(args);

      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, pageTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.module.${preferredStyleExtension}`, cssModuleTemplate);
      await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.tsx`, pageSpecTemplate);

      const moduleFile = './module.ts';
      if (await this.fse.pathExists(moduleFile)) {
        const pagesDeclarationStartString = 'export const pages = [';
        let moduleContents = this.fs.readFileSync(moduleFile, 'utf8').toString();

        moduleContents = `import { ${pascalCaseName} } from './${camelCaseName}/${camelCaseName}';
${moduleContents.replace(pagesDeclarationStartString, `${pagesDeclarationStartString}
  new ${pascalCaseName}(),`)}`;

        await this.fse.outputFile(moduleFile, moduleContents);
      }
    }).Execute();
  }
}
