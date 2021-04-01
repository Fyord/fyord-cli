import * as cp from 'child_process';
import * as fs from 'fs';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../fileSystem/module';
import { AsyncCommand, Result } from 'tsbase';
import { IOperation } from './operation';

const defaultName = 'fyord app';

export class NewOperation implements IOperation {
  constructor(private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter) { }

  public async Execute(args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      const name = args[0];

      this.initializeNewBoilerplateRepoWithName(name);

      const filesWithDefaultName = [
        `./${name}/src/index.html`,
        `./${name}/src/pages/home/home.tsx`,
        `./${name}/src/pages/home/home.spec.ts`
      ];

      for (const fileName of filesWithDefaultName) {
        await this.updateDefaultNameInFile(fileName, name);
      }
    }).Execute();
  }

  private initializeNewBoilerplateRepoWithName(name: string): void {
    cp.execSync(`git clone https://github.com/Fyord/fyord-boilerplate.git ./${name}`);
    fs.rmdirSync(`./${name}/.git`, { recursive: true });
    cp.execSync(`cd ./${name} && git init`);
    cp.execSync(`cd ./${name} && git add .`);
    cp.execSync(`cd ./${name} && git commit -m "Scaffold ${name} with fyord cli"`);
  }

  private async updateDefaultNameInFile(fileName: string, name: string): Promise<void> {
    if (await this.fse.pathExists(fileName)) {
      let moduleContents = fs.readFileSync(fileName, 'utf8').toString();
      moduleContents = moduleContents.replace(defaultName, name);
      await this.fse.outputFile(fileName, moduleContents);
    }
  }
}
