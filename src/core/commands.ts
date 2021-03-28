import { Result } from 'tsbase';
import { CliName } from './constants';
import { GenerateOperation } from './operations/generate';
import { HelpOperation } from './operations/help';
import { PreRenderOperation } from './operations/preRender';
import { VersionOperation } from './operations/version';

export type Command = {
  Name: string;
  Description: string;
  Arguments: string[];
  Operation: (args: string[]) => Result;
  Example: string;
}

export enum Commands {
  Help = 'help',
  Version = 'version',
  PreRender = 'preRender',
  Generate = 'generate'
}

export const CommandMap = new Map<Commands, Command>([
  [Commands.Help, {
    Name: Commands.Help,
    Description: 'List available commands and arguments',
    Arguments: ['Command Name'],
    Operation: (args) => new HelpOperation().Execute(args),
    Example: `${CliName} ${Commands.Help} ${Commands.PreRender}`
  }],
  [Commands.Version, {
    Name: Commands.Version,
    Description: 'Prints the current version of fyord-cli',
    Arguments: [],
    Operation: () => new VersionOperation().Execute(),
    Example: `${CliName} ${Commands.Version}`
  }],
  [Commands.PreRender, {
    Name: Commands.PreRender,
    Description: 'Crawls and pre renders pages within the app',
    Arguments: [],
    Operation: () => new PreRenderOperation().Execute(),
    Example: `${CliName} ${Commands.PreRender}`
  }],
  [Commands.Generate, {
    Name: Commands.Generate,
    Description: 'Scaffold a fyord app component, page, etc.',
    Arguments: ['Type (component, page, etc.)', 'Name (ex. MyComponent)'],
    Operation: (args) => new GenerateOperation().Execute(args),
    Example: `${CliName} ${Commands.Generate} component myComponent`
  }]
]);
