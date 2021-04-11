import { AsyncCommand, Result } from 'tsbase';
import { IOperation } from './operation';

export class ConfigureOperation implements IOperation {
  public Execute(): Promise<Result> {
    return new AsyncCommand(async () => {

    }).Execute();
  }
}
