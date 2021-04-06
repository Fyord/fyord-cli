import * as child_process from 'child_process';
import * as filesystem from 'fs';
import { AsyncCommand, Result } from 'tsbase';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../fileSystem/module';
import { IOperation } from './operation';

const defaultName = 'fyord app';

export class NewOperation implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    private fs: any = filesystem,
    private cp: any = child_process) { }

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
    name = name || 'fyord-boilerplate';
    this.cp.execSync(`git clone https://github.com/Fyord/fyord-boilerplate.git ./${name}`);
    this.fs.rmdirSync(`./${name}/.git`, { recursive: true });
    this.cp.execSync(`cd ./${name} && git init`);
    this.cp.execSync(`cd ./${name} && git add .`);
    this.cp.execSync(`cd ./${name} && git commit -m "Scaffold ${name} with fyord cli"`);
  }

  private async updateDefaultNameInFile(fileName: string, name: string): Promise<void> {
    if (await this.fse.pathExists(fileName)) {
      let moduleContents = this.fs.readFileSync(fileName, 'utf8').toString();
      moduleContents = moduleContents.replace(defaultName, name);
      await this.fse.outputFile(fileName, moduleContents);
    }
  }
}
