import { ComponentGenerator } from './componentGenerator';
import { PageGenerator } from './pageGenerator';
import { PipelineGenerator } from './pipelineGenerator';
import { SingletonGenerator } from './singletonGenerator';

export interface IGenerator {
  Alias: string;
  Generate(args: string[]): Promise<void>;
}

export enum Generators {
  Component = 'component',
  Page = 'page',
  Singleton = 'singleton',
  Pipeline = 'pipeline'
}

export const GeneratorMap = new Map<Generators, IGenerator>([
  [Generators.Component, new ComponentGenerator()],
  [Generators.Page, new PageGenerator()],
  [Generators.Singleton, new SingletonGenerator()],
  [Generators.Pipeline, new PipelineGenerator()]
]);
