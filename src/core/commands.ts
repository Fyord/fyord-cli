import { CliName } from './constants';
import { GenerateOperation } from './operations/generate';
import { HelpOperation } from './operations/help';
import { IOperation } from './operations/operation';
import { PreRenderOperation } from './operations/preRender';
import { VersionOperation } from './operations/version';

export type Command = {
  Name: string;
  Description: string;
  Arguments: string[];
  Operation: IOperation;
  Example: string;
}

export enum Commands {
  Help = 'help',
  Version = 'version',
  PreRender = 'prerender',
  Generate = 'generate'
}

export const CommandMap = new Map<Commands, Command>([
  [Commands.Help, {
    Name: Commands.Help,
    Description: 'List available commands and arguments',
    Arguments: ['Command Name'],
    Operation: new HelpOperation(),
    Example: `${CliName} ${Commands.Help} ${Commands.PreRender}`
  }],
  [Commands.Version, {
    Name: Commands.Version,
    Description: 'Prints the current version of fyord-cli',
    Arguments: [],
    Operation: new VersionOperation(),
    Example: `${CliName} ${Commands.Version}`
  }],
  [Commands.PreRender, {
    Name: Commands.PreRender,
    Description: 'Crawls and pre renders pages within the app',
    Arguments: [],
    Operation: new PreRenderOperation(),
    Example: `${CliName} ${Commands.PreRender}`
  }],
  [Commands.Generate, {
    Name: Commands.Generate,
    Description: 'Scaffold a fyord app component, page, etc.',
    Arguments: ['Type (component, page, etc.)', 'Name (ex. MyComponent)'],
    Operation: new GenerateOperation(),
    Example: `${CliName} ${Commands.Generate} component myComponent`
  }]
]);
