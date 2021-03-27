import { CommandName } from './constants';
import { PreRender } from './module';
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
  PreRender = 'preRender'
}

export const CommandMap = new Map<Commands, Command>([
  [Commands.Help, {
    Name: Commands.Help,
    Description: 'List available commands and arguments',
    Arguments: ['Command Name'],
    Operation: (args) => Help(args),
    Example: `${CommandName} ${Commands.Help} ${Commands.PreRender}`
  }],
  [Commands.PreRender, {
    Name: Commands.PreRender,
    Description: 'Crawls and pre renders pages within the app',
    Arguments: [],
    Operation: () => PreRender(),
    Example: `${CommandName} ${Commands.PreRender}`
  }]
]);
