import * as cp from 'child_process';
import * as fs from 'fs';
import { AsyncCommand, Result } from 'tsbase';
import { IOperation } from './operation';

export class NewOperation implements IOperation {
  public async Execute(args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      const name = args[0];

      cp.execSync(`git clone https://github.com/Fyord/fyord-boilerplate.git ./${name}`);
      fs.rmdirSync(`./${name}/.git`, { recursive: true });
      cp.execSync(`cd ./${name} && git init`);
      cp.execSync(`cd ./${name} && git add .`);
      cp.execSync(`cd ./${name} && git commit -m "Scaffold ${name} with fyord cli"`);
    }).Execute();
  }
}
