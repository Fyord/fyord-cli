import { AsyncCommand, Result } from 'tsbase';
import { IOperation } from './operation';

export class BuildStaticOperation implements IOperation {
  public async Execute(_args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      console.log('got here');
    }).Execute();
  }
}
