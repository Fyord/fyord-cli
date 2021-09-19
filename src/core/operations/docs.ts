import * as child_process from 'child_process';
import { AsyncCommand, Result } from 'tsbase';
import { IOperation } from './operation';

export class DocsOperation implements IOperation {
  constructor(
    private cp: any = child_process
  ) { }

  public async Execute(args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      const query = encodeURIComponent(args.join(' '));

      this.cp.exec(`open https://fyord.dev/docs?search=${query}`);
    }).Execute();
  }
}
