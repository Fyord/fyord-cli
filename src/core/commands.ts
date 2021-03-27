import { CommandName as CliName } from './constants';
import { PreRender } from './module';
import { Generate } from './operations/generate';
import { Help } from './operations/help';

export type Operation = (args?: string[]) => void;

export type Command = {
  Name: string;
  Description: string;
  Arguments: string[];
  Operation: Operation;
  Example: string;
}

export enum Commands {
  Help = 'help',
  PreRender = 'preRender',
  Generate = 'generate'
}

export const CommandMap = new Map<Commands, Command>([
  [Commands.Help, {
    Name: Commands.Help,
    Description: 'List available commands and arguments',
    Arguments: ['Command Name'],
    Operation: (args) => Help(args),
    Example: `${CliName} ${Commands.Help} ${Commands.PreRender}`
  }],
  [Commands.PreRender, {
    Name: Commands.PreRender,
    Description: 'Crawls and pre renders pages within the app',
    Arguments: [],
    Operation: () => PreRender(),
    Example: `${CliName} ${Commands.PreRender}`
  }],
  [Commands.Generate, {
    Name: Commands.Generate,
    Description: 'Scaffold a fyord app component, page, etc.',
    Arguments: ['Type (component, page, etc.)', 'Name (ex. MyComponent)'],
    Operation: (args) => Generate(args),
    Example: `${CliName} ${Commands.Generate} component myComponent`
  }]
]);
