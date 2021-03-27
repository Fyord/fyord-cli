import { Command, Result } from 'tsbase';
import { VersionNumber } from '../constants';
import { IOperation } from './operation';

export class VersionOperation implements IOperation {
  public Execute(): Result {
    return new Command(() => {
      console.log(VersionNumber);
    }).Execute();
  }
}
