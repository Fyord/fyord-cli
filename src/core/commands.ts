import { CliName } from './constants';
import {
  ConfigureOperation, GenerateOperation, HelpOperation, IOperation,
  NewOperation, PreRenderOperation, VersionOperation
} from './operations/module';

export enum Commands {
  Help = 'help',
  Version = 'version',
  PreRender = 'prerender',
  Generate = 'generate',
  New = 'new',
  Configure = 'configure'
}

export type Command = {
  Name: Commands;
  Alias: string;
  Description: string;
  Arguments: string[];
  Operation: IOperation;
  Example: string;
  AdditionalDetails?: object;
}

export const CommandMap = new Map<Commands, Command>([
  [Commands.Help, {
    Name: Commands.Help,
    Alias: 'h',
    Description: 'List available commands and arguments',
    Arguments: ['Command Name'],
    Operation: new HelpOperation(),
    Example: `${CliName} ${Commands.Help} ${Commands.PreRender}`
  }],
  [Commands.Version, {
    Name: Commands.Version,
    Alias: 'v',
    Description: 'Prints the current version of fyord-cli',
    Arguments: [],
    Operation: new VersionOperation(),
    Example: `${CliName} ${Commands.Version}`
  }],
  [Commands.New, {
    Name: Commands.New,
    Alias: 'n',
    Description: 'Creates a new fyord app',
    Arguments: ['Name', 'Style Extension (css, scss) *optional'],
    Operation: new NewOperation(),
    Example: `${CliName} ${Commands.New} NewFyordApp`,
    AdditionalDetails: {
      'Requires': ['git']
    }
  }],
  [Commands.Generate, {
    Name: Commands.Generate,
    Alias: 'g',
    Description: 'Scaffold a fyord app component, page, etc. in the current directory',
    Arguments: ['Type (component, page, etc.)', 'Name (ex. MyComponent)'],
    Operation: new GenerateOperation(),
    Example: `${CliName} ${Commands.Generate} component myComponent`,
    AdditionalDetails: {
      'Available Types': ['component (c)', 'page (p)', 'singleton (s)', 'pipeline (pl)'],
      'Casing convention': 'PascalCase will be used in declarations and camelCase will be used in file names'
    }
  }],
  [Commands.Configure, {
    Name: Commands.Configure,
    Alias: 'c',
    Description: 'Configure settings saved in fyord.json configuration file',
    Operation: new ConfigureOperation(),
    Arguments: [],
    Example: `${CliName} ${Commands.Configure}`
  }],
  [Commands.PreRender, {
    Name: Commands.PreRender,
    Alias: 'pr',
    Description: 'Crawls and pre renders pages within the app',
    Arguments: [],
    Operation: new PreRenderOperation(),
    Example: `${CliName} ${Commands.PreRender}`,
    AdditionalDetails: {
      'Utilizes config file if available': './fyord.json'
    }
  }]
]);
