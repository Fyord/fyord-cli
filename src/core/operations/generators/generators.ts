import { ComponentGenerator } from './componentGenerator';
import { PageGenerator } from './pageGenerator';
import { SingletonGenerator } from './singletonGenerator';

export interface IGenerator {
  Alias: string;
  Generate(args: string[]): Promise<void>;
}

export enum Generators {
  Component = 'component',
  Page = 'page',
  Singleton = 'singleton'
}

export const GeneratorMap = new Map<Generators, IGenerator>([
  [Generators.Component, new ComponentGenerator()],
  [Generators.Page, new PageGenerator()],
  [Generators.Singleton, new SingletonGenerator()]
]);
