import * as child_process from 'child_process';
import { AsyncCommand, Result } from 'tsbase';
import { IOperation } from './operation';

export class DocsOperation implements IOperation {
  public async Execute(args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      const query = args[0];

      child_process.exec(`open https://fyord.dev/docs?search=${query}`);
    }).Execute();
  }
}
