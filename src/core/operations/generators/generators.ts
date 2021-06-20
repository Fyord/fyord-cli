import { Result } from 'tsbase';
import { ComponentGenerator } from './componentGenerator';
import { CustomElementGenerator } from './customElementGenerator';
import { DebugGenerator } from './debugGenerator';
import { PageGenerator } from './pageGenerator';
import { PipelineGenerator } from './pipelineGenerator';
import { SingletonGenerator } from './singletonGenerator';
import { WebComponentGenerator } from './webComponentGenerator';

export interface IGenerator {
  Alias: string;
  Generate(args: string[]): Promise<Result>;
}

export enum Generators {
  Component = 'component',
  Page = 'page',
  Singleton = 'singleton',
  Pipeline = 'pipeline',
  Debug = 'debug',
  CustomElement = 'customElement',
  WebComponent = 'webComponent'
}

export const GeneratorMap = new Map<Generators, IGenerator>([
  [Generators.Component, new ComponentGenerator()],
  [Generators.Page, new PageGenerator()],
  [Generators.Singleton, new SingletonGenerator()],
  [Generators.Pipeline, new PipelineGenerator()],
  [Generators.Debug, new DebugGenerator()],
  [Generators.CustomElement, new CustomElementGenerator()],
  [Generators.WebComponent, new WebComponentGenerator()]
]);
