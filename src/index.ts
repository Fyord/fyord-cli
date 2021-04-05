#!/usr/bin/env node
import { Strings } from 'tsbase';
import { CliName, VersionNumber } from './core/constants';
import { CommandMap, Commands } from './core/module';

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
  const command = CommandMap.has(commandArgument as Commands) ?
    CommandMap.get(commandArgument as Commands) :
    Array.from(CommandMap.values()).filter(c => c.Alias === commandArgument)[0];

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
