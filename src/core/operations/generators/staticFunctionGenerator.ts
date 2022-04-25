import { AsyncCommand, Result, Strings } from 'tsbase';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { DIModule } from '../../../diModule';
import { IGenerator } from './iGenerator';
import { StaticFunctionTemplate } from './templates/staticFunction/staticFunctionTemplate';
import { StaticFunctionSpecTemplate } from './templates/staticFunction/staticFunctionSpecTemplate';

export class StaticFunctionGenerator implements IGenerator {
  public Alias = 'sf';

  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter
  ) { }

  public async Generate(args: string[]): Promise<Result> {
    return new AsyncCommand(async () => {
      const name = args[0];
      const extension = args[1];

      if (!name || !extension) {
        throw new Error(`"name" and "extension" (2) args are required to generate a static function.
Example usage: fyord g sf functionName json`);
      }

      const camelCaseName = Strings.CamelCase(name);
      const customElementTemplate = StaticFunctionTemplate(args);
      const customElementSpecTemplate = StaticFunctionSpecTemplate(args);

      await this.fse.outputFile(`./${camelCaseName}.${extension}.ts`, customElementTemplate);
      await this.fse.outputFile(`./tests/${camelCaseName}.${extension}.spec.ts`, customElementSpecTemplate);
    }).Execute();
  }
}
