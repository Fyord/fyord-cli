import { Result } from 'tsbase';

export interface IOperation {
  Execute(args: string[]): Promise<Result<null>>;
}
