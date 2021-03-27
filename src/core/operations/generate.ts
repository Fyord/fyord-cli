import { Command, Result } from 'tsbase';
import { GeneratorMap, Generators } from './generators/module';
import { IOperation } from './operation';

export class GenerateOperation implements IOperation {
  public Execute(args?: string[]): Result {
    return new Command(() => {
      const generatorName = args?.[0];
      const remainingArgs = args?.slice(1, args.length) || [];

      const generator = GeneratorMap.get(generatorName as Generators);

      if (generator) {
        generator.Generate(remainingArgs);
      } else {
        console.warn(`Unknown generator, "${generatorName}"`);
      }
    }).Execute();
  }
}
