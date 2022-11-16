import { AsyncCommand, Result } from 'tsbase';
import { IOperation } from '../operation';

export class ElectronInitOperation implements IOperation {
  constructor() { }

  public Execute(): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      console.log('Electron init operation scaffolded!');
    }).Execute();
  }
}
