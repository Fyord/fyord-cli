import * as fse from 'fs-extra';
import { FileSystemAdapter } from '../../../settings/fileSystemAdapter';
import { Strings } from 'tsbase';
import { IGenerator } from './generators';
import { PageTemplate, CssModuleTemplate, PageSpecTemplate } from './templates/module';

export class PageGenerator implements IGenerator {
  public async Generate(args: string[]): Promise<void> {
    const name = args[0];
    const camelCaseName = Strings.CamelCase(name);
    const pascalCaseName = Strings.PascalCase(name);

    const pageTemplate = PageTemplate(args);
    const cssModuleTemplate = CssModuleTemplate(args);
    const pageSpecTemplate = PageSpecTemplate(args);

    await fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, pageTemplate);
    await fse.outputFile(`./${camelCaseName}/${camelCaseName}.module.scss`, cssModuleTemplate);
    await fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.tsx`, pageSpecTemplate);

    const moduleFile = './module.ts';
    if (await fse.pathExists(moduleFile)) {
      const pagesDeclarationStartString = 'export const pages = [';
      let moduleContents = FileSystemAdapter.readFileSync(moduleFile, 'utf8').toString();

      moduleContents = `import { ${pascalCaseName} } from './${camelCaseName}/${camelCaseName}';
${moduleContents.replace(pagesDeclarationStartString, `${pagesDeclarationStartString}
  new ${pascalCaseName}(),`)}`;

      await fse.outputFile(moduleFile, moduleContents);
    }
  }
}
