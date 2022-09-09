import { AsyncCommand, Result } from 'tsbase';
import { VersionNumber } from '../constants';
import { IOperation } from './operation';

export class VersionOperation implements IOperation {
  public async Execute(): Promise<Result<null>> {
    return await new AsyncCommand(async () => {
      console.log(VersionNumber);
    }).Execute();
  }
}
