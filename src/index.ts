#!/usr/bin/env node
import { Strings } from 'tsbase';
import { CliName, Command, CommandMap, VersionNumber } from './core/module';
import { GetAliasableValueFromMap } from './core/utility/module';

const commandKey = process.argv[2] || 'help';
const args = process.argv.slice(3, process.argv.length);

(async () => {
  console.log(`
  __                     _
 / _|                   | |
| |_ _   _  ___  _ __ __| |
|  _| | | |/ _ \\| '__/_\`\| |
| | | |_| | (_) | | | (_| |
|_|  \\__, |\\___/|_|  \\__,_|
      __/ |
     |___/  Version: ${VersionNumber}
`);

  console.log(`
Executing "${CliName} ${commandKey}${args.length > 0 ? ` ${args.join(Strings.Space)}` : Strings.Empty}"
`);

  const commandArgument = commandKey.toLowerCase().replace(/-/g, Strings.Empty);
  const command = GetAliasableValueFromMap<Command>(CommandMap, commandArgument);

  if (command) {
    const result = await command.Operation.Execute(args);

    if (result.IsSuccess) {
      console.log(`
Command completed successfully`);
    } else {
      console.log(`
Command completed with ${result.ErrorMessages.length} error(s), see below output for details:
${result.ErrorMessages.join('\n')}`);
    }
  } else {
    console.error(`Unknown command, "${commandKey}"`);
  }
})();
