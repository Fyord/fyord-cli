import * as fse from 'fs-extra';
import { Strings } from 'tsbase';
import { IGenerator } from './generators';
import { CssModuleTemplate } from './templates/ccsModuleTemplate';
import { ComponentSpecTemplate } from './templates/componentSpecTemplate';
import { ComponentTemplate } from './templates/componentTemplate';

export class ComponentGenerator implements IGenerator {
  public async Generate(args: string[]): Promise<void> {
    const camelCaseName = Strings.CamelCase(args[0]);

    const componentTemplate = ComponentTemplate(args);
    const cssModuleTemplate = CssModuleTemplate(args);
    const componentSpecTemplate = ComponentSpecTemplate(args);

    await fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, componentTemplate);
    await fse.outputFile(`./${camelCaseName}/${camelCaseName}.module.scss`, cssModuleTemplate);
    await fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.tsx`, componentSpecTemplate);
  }
}
