import { Strings } from 'tsbase';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IGenerator } from './generators';
import { ComponentSpecTemplate, ComponentTemplate, CssModuleTemplate } from './templates/module';

export class ComponentGenerator implements IGenerator {
  constructor(private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter) { }

  public async Generate(args: string[]): Promise<void> {
    const camelCaseName = Strings.CamelCase(args[0]);

    const componentTemplate = ComponentTemplate(args);
    const cssModuleTemplate = CssModuleTemplate(args);
    const componentSpecTemplate = ComponentSpecTemplate(args);

    await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.tsx`, componentTemplate);
    await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.module.scss`, cssModuleTemplate);
    await this.fse.outputFile(`./${camelCaseName}/${camelCaseName}.spec.tsx`, componentSpecTemplate);
  }
}
