import { ComponentGenerator } from './componentGenerator';
import { CustomElementGenerator } from './customElementGenerator';
import { DebugGenerator } from './debugGenerator';
import { IGenerator } from './iGenerator';
import { PageGenerator } from './pageGenerator';
import { PipelineGenerator } from './pipelineGenerator';
import { SingletonGenerator } from './singletonGenerator';
import { StaticFunctionGenerator } from './staticFunctionGenerator';
import { WebComponentGenerator } from './webComponentGenerator';

export enum Generators {
  Component = 'component',
  Page = 'page',
  Singleton = 'singleton',
  Pipeline = 'pipeline',
  Debug = 'debug',
  CustomElement = 'customElement',
  WebComponent = 'webComponent',
  StaticFunction = 'staticFunction'
}

export const GeneratorMap = new Map<Generators, IGenerator>([
  [Generators.Component, new ComponentGenerator()],
  [Generators.Page, new PageGenerator()],
  [Generators.Singleton, new SingletonGenerator()],
  [Generators.Pipeline, new PipelineGenerator()],
  [Generators.Debug, new DebugGenerator()],
  [Generators.CustomElement, new CustomElementGenerator()],
  [Generators.WebComponent, new WebComponentGenerator()],
  [Generators.StaticFunction, new StaticFunctionGenerator()]
]);
