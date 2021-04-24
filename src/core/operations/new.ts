import * as child_process from 'child_process';
import * as filesystem from 'fs';
import { AsyncCommand, Result } from 'tsbase';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../fileSystem/module';
import { IOperation } from './operation';

const defaultName = 'fyord app';
enum StyleExtensions {
  Css = 'css',
  Scss = 'scss'
}

export class NewOperation implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    private fs: any = filesystem,
    private cp: any = child_process) { }

  public async Execute(args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      const name = args[0];
      const preferredStyleExtension = args[1] || StyleExtensions.Css;

      if (preferredStyleExtension !== StyleExtensions.Css && preferredStyleExtension !== StyleExtensions.Scss) {
        throw new Error(`The style extension given: "${preferredStyleExtension}" is invalid. Please use "css" or "scss"`);
      }

      this.initializeNewBoilerplateRepoWithName(name);

      const filesWithDefaultName = [`./${name}/src/index.html`];
      for (const fileName of filesWithDefaultName) {
        await this.updateDefaultNameInFile(fileName, name);
      }

      if (preferredStyleExtension === StyleExtensions.Scss) {
        await this.initializeSettingsWithPreferredFileExtension(name, preferredStyleExtension);
        this.updateStyleFileExtensions(name, preferredStyleExtension);
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

  private async initializeSettingsWithPreferredFileExtension(name: string, preferredStyleExtension: StyleExtensions) {
    await this.fse.outputFile(`./${name}/fyord.json`, `{"settings":[{"key":"styleExtension","value":"${preferredStyleExtension}"}]}`);
  }

  private async updateDefaultNameInFile(fileName: string, name: string): Promise<void> {
    if (await this.fse.pathExists(fileName)) {
      let moduleContents = this.fs.readFileSync(fileName, 'utf8').toString();
      moduleContents = moduleContents.replace(defaultName, name);
      await this.fse.outputFile(fileName, moduleContents);
    }
  }

  private updateStyleFileExtensions(name: string, preferredStyleExtension: StyleExtensions) {
    const filesWithStyleExtension = [
      `${name}/src/styles/base.css`,
      `${name}/src/styles/normalize.css`,
      `${name}/src/pages/not-found/not-found.module.css`,
      `${name}/src/pages/welcome/welcome.module.css`
    ];

    filesWithStyleExtension.forEach(fileName => {
      const newFileName = `./${fileName.split('.')[0]}.${preferredStyleExtension}`;
      this.fs.renameSync(`./${fileName}`, newFileName);
    });
  }
}
