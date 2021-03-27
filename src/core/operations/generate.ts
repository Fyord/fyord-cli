import { Operation } from '../commands';
import { GeneratorMap, Generators } from './generators/module';

export const Generate: Operation = (args?: string[]) => {
  const generatorName = args?.[0];
  const remainingArgs = args?.slice(1, args.length) || [];

  const generator = GeneratorMap.get(generatorName as Generators);

  if (generator) {
    generator.Generate(remainingArgs);
  } else {
    console.warn(`Unknown generator, "${generatorName}"`);
  }
};
