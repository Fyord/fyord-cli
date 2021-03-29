#!/usr/bin/env node
import { Strings } from 'tsbase';
import { CliName, VersionNumber } from './core/constants';
import { CommandMap, Commands } from './core/module';

const commandKey = process.argv[2] || 'help';
const args = process.argv.slice(3, process.argv.length);

(() => {
  console.log(`
  __                     _
 / _|                   | |
| |_ _   _  ___  _ __ __| |
|  _| | | |/ _ \\| '__/_\`\| |
| | | |_| | (_) | | | (_| |
|_|  \\__, |\\___/|_|  \\__,_|
      __/ |
     |___/   Version: ${VersionNumber}
`);

  console.log(`
Executing "${CliName} ${commandKey}${args.length > 0 ? ` ${args.join(Strings.Space)}` : Strings.Empty}"

`);

  const command = CommandMap.get(commandKey.toLowerCase().replace(/-/g, Strings.Empty) as Commands);

  if (command) {
    command.Operation.Execute(args);
  } else {
    console.error(`Unknown command, "${commandKey}"`);
  }
})();
