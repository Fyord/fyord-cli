import { Command, Result } from 'tsbase';
import { CommandMap, Commands } from '../commands';
import { IOperation } from './operation';

export class HelpOperation implements IOperation {
  public Execute(args?: string[]): Result {
    return new Command(() => {
      const commandName = args?.[0] as Commands;

      for (const command of CommandMap) {
        if (!commandName || command[0] === commandName) {
          console.log({
            Name: command[1].Name,
            Description: command[1].Description,
            Arguments: command[1].Arguments,
            Example: command[1].Example
          });
        }
      }

      if (commandName && !CommandMap.get(commandName)) {
        console.warn(`Unknown command, "${commandName}"`);
      }
    }).Execute();
  }
}
