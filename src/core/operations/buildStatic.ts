import { AsyncCommand, Result } from 'tsbase';
import * as child_process from 'child_process';
import { DIModule } from '../../diModule';
import { IOperation } from './operation';

export class BuildStaticOperation implements IOperation {
  constructor(
    private cp: typeof child_process = DIModule.ChildProcess
  ) {}

  public async Execute(_args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      this.cp.execSync('npm run build-static');
    }).Execute();
  }
}
