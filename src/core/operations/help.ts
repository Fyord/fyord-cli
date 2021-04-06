import { AsyncCommand, Result } from 'tsbase';
import { Command, CommandMap, Commands } from '../commands';
import { GetAliasableValueFromMap } from '../utility/getAliasableValueFromMap';
import { IOperation } from './operation';

export class HelpOperation implements IOperation {
  constructor(
    private mainConsole: Console = console
  ) { }

  public async Execute(args?: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      const commandNameArgument = args?.[0] as Commands;
      if (!commandNameArgument) {
        this.mainConsole.log(`Pass a command name, like "fyord help {name}" for additional details on a given command
`);
      }

      const namedCommand = GetAliasableValueFromMap<Command>(CommandMap, commandNameArgument);
      if (namedCommand) {
        this.logCommandDetails(namedCommand.Name, namedCommand.Name, namedCommand);
      } else {
        for (const commandMap of CommandMap) {
          const [commandName, commandObject] = commandMap;
          this.logCommandDetails(commandNameArgument, commandName, commandObject);
        }
      }

      if (commandNameArgument && !namedCommand) {
        this.mainConsole.error(`Unknown command, "${commandNameArgument}"`);
      }
    }).Execute();
  }

  private logCommandDetails(commandNameArgument: Commands, commandName: string, commandObject: Command) {
    const commandNameMatchesArgument = commandName === commandNameArgument;

    if (!commandNameArgument || commandNameMatchesArgument) {
      this.mainConsole.log({
        Name: commandObject.Name,
        Alias: commandObject.Alias,
        Description: commandObject.Description,
        Arguments: commandObject.Arguments,
        Example: commandObject.Example
      });

      if (commandObject.AdditionalDetails && commandNameMatchesArgument) {
        this.mainConsole.log(`
Additional details: `);
        this.mainConsole.log(commandObject.AdditionalDetails);
      }
    }
  }
}
