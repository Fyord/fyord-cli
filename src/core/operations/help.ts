import { AsyncCommand, Result } from 'tsbase';
import { CommandMap, Commands } from '../commands';
import { IOperation } from './operation';

export class HelpOperation implements IOperation {
  constructor(
    private mainConsole: Console = console
  ) { }

  public async Execute(args?: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      const commandName = args?.[0] as Commands;

      for (const command of CommandMap) {
        if (!commandName || command[0] === commandName) {
          this.mainConsole.log({
            Name: command[1].Name,
            Description: command[1].Description,
            Arguments: command[1].Arguments,
            Example: command[1].Example
          });
        }
      }

      if (commandName && !CommandMap.get(commandName)) {
        this.mainConsole.error(`Unknown command, "${commandName}"`);
      }
    }).Execute();
  }
}
