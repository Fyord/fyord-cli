#!/usr/bin/env node
import { Strings } from 'tsbase';
import { CommandName } from './core/constants';
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
     |___/

`);

  console.log(`
Executing "${CommandName} ${commandKey}${args.length > 0 ? ` ${args.join(Strings.Space)}` : Strings.Empty}"

`);

  CommandMap.get(commandKey.replace('--', Strings.Empty) as Commands)?.Operation(args);
})();
