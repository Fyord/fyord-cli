import { Result } from 'tsbase';

export interface IOperation {
  Execute(args: string[]): Result;
}
