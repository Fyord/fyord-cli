import { AsyncCommand, Result } from 'tsbase';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IGenerator } from './iGenerator';
import { AzurePipelineTemplate, GitHubActionTemplate } from './templates/module';

export enum PipelineTypes {
  GitHub = 'github',
  Azure = 'azure'
}

const properFormatExample = '(format example: fyord generate pipeline github master)';

export class PipelineGenerator implements IGenerator {
  public Alias = 'pl';

  constructor(private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter) { }

  public async Generate(args: string[]): Promise<Result> {
    return new AsyncCommand(async () => {

      const type = args[0];
      const trunk = args[1];

      this.throwErrorsIfArgumentsInvalid(type, trunk);

      if (type === PipelineTypes.Azure) {
        await this.fse.outputFile('azure-pipelines.yml', AzurePipelineTemplate([trunk]));
      } else {
        await this.fse.outputFile('.github/workflows/ci.yml', GitHubActionTemplate([trunk]));
      }
    }).Execute();
  }

  private throwErrorsIfArgumentsInvalid(type: string, trunk: string) {
    if (!type) {
      throw new Error(`No pipeline type argument given. Valid types: ${PipelineTypes.GitHub} & ${PipelineTypes.Azure}.
${properFormatExample}`);
    }

    if (!trunk) {
      throw new Error(`No trunk branch specified. Specify a branch that will trigger builds (master, main, etc.).
${properFormatExample}`);
    }

    if (type !== PipelineTypes.GitHub && type !== PipelineTypes.Azure) {
      throw new Error(`Invalid pipeline type: "${type}" given. Valid types: ${PipelineTypes.GitHub} & ${PipelineTypes.Azure}.
${properFormatExample}`);
    }
  }
}
