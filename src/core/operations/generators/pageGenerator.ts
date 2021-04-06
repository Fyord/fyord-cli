import { IFileSystemAdapter, Strings } from 'tsbase';
import { FileSystemAdapter, FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { PageTemplate, CssModuleTemplate, PageSpecTemplate } from './templates/module';
import { IGenerator } from './generators';

export class PageGenerator implements IGenerator {
  public Alias = 'p';

  constructor(
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    private fs: IFileSystemAdapter = FileSystemAdapter) { }

  public async Generate(args: string[]): Promise<void> {
    const name = args[0];
    const camelCaseName = Strings.CamelCase(name);
    const pascalCaseName = Strings.PascalCase(name);

    const pageTemplate = PageTemplate(args);
    const cssModuleTemplate = CssModuleTemplate(args);
    const pageSpecTemplate = PageSpecTemplate(args);

    await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, pageTemplate);
    await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.module.scss`, cssModuleTemplate);
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
  }
}
