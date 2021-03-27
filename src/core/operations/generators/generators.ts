import { ComponentGenerator } from './componentGenerator';

export interface IGenerator {
  Generate(args: string[]): Promise<void>;
}

export enum Generators {
  Component = 'component'
}

export const GeneratorMap = new Map<Generators, IGenerator>([
  [Generators.Component, new ComponentGenerator()]
]);
