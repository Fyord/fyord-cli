import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IGenerator } from './generators';
import { AzurePipelineTemplate, GitHubActionTemplate } from './templates/module';

enum PipelineTypes {
  GitHub = 'github',
  Azure = 'azure'
}

export class PipelineGenerator implements IGenerator {
  public Alias = 'pl';

  constructor(private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter) { }

  public async Generate(args: string[]): Promise<void> {
    const type = args[0];
    const trunk = args[1];

    this.throwErrorsIfArgumentsInvalid(type, trunk);

    if (type === PipelineTypes.Azure) {
      await this.fse.outputFile('azure-pipelines.yml', AzurePipelineTemplate([trunk]));
    } else {
      await this.fse.outputFile('.github/workflows/ci.yml', GitHubActionTemplate([trunk]));
    }
  }

  private throwErrorsIfArgumentsInvalid(type: string, trunk: string) {
    if (!type) {
      throw new Error(`No pipeline type argument given. Valid types: ${PipelineTypes.GitHub} & ${PipelineTypes.Azure}.`);
    }

    if (!trunk) {
      throw new Error('No trunk branch specified. Specify a branch that will trigger builds (master, main, etc.).');
    }

    if (type !== PipelineTypes.GitHub && type !== PipelineTypes.Azure) {
      throw new Error(`Invalid pipeline type: "${type}" given. Valid types: ${PipelineTypes.GitHub} & ${PipelineTypes.Azure}.`);
    }
  }
}
