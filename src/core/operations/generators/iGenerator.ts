import { Result } from 'tsbase/Patterns/Result/Result';

export interface IGenerator {
  Alias: string;
  Generate(args: string[]): Promise<Result>;
}
