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

      this.cloneBoilerplateRepo(name);

      const filesWithDefaultName = [`./${name}/src/index.html`];
      for (const fileName of filesWithDefaultName) {
        await this.updateTextInFile(fileName, defaultName, name);
      }

      if (preferredStyleExtension !== StyleExtensions.Css) {
        await this.initializeSettingsWithPreferredFileExtension(name, preferredStyleExtension);
        this.updateStyleFileExtensions(name, preferredStyleExtension);
        await this.updateFilesWithStyleExtension(name, preferredStyleExtension);
      }

      this.initRepoWithScaffoldingCommit(name);
    }).Execute();
  }

  private cloneBoilerplateRepo(name: string): void {
    name = name || 'fyord-boilerplate';
    this.cp.execSync(`git clone https://github.com/Fyord/fyord-boilerplate.git ./${name}`);
    this.fs.rmdirSync(`./${name}/.git`, { recursive: true });
  }

  private async initializeSettingsWithPreferredFileExtension(name: string, preferredStyleExtension: StyleExtensions) {
    await this.fse.outputFile(`./${name}/fyord.json`, `{"settings":[{"key":"styleExtension","value":"${preferredStyleExtension}"}]}`);
  }

  private async updateTextInFile(fileName: string, oldText: string, newText: string): Promise<void> {
    if (await this.fse.pathExists(fileName)) {
      let fileContents = this.fs.readFileSync(fileName, 'utf8').toString();
      fileContents = fileContents.replace(oldText, newText);
      await this.fse.outputFile(fileName, fileContents);
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
      const newFileName = fileName.includes('module') ?
        `./${fileName.split('.')[0]}.module.${preferredStyleExtension}` :
        `./${fileName.split('.')[0]}.${preferredStyleExtension}`;

      this.fs.renameSync(`./${fileName}`, newFileName);
    });
  }

  private async updateFilesWithStyleExtension(name: string, preferredStyleExtension: StyleExtensions) {
    const fileWithStyleExtension = [
      `./${name}/index.ts`,
      `./${name}/src/pages/not-found/not-found.tsx`,
      `./${name}/src/pages/welcome/welcome.tsx`
    ];

    for (const fileName of fileWithStyleExtension) {
      await this.updateTextInFile(fileName, `.${StyleExtensions.Css}';`, `.${preferredStyleExtension}';`);
    }
  }

  private initRepoWithScaffoldingCommit(name: string): void {
    this.cp.execSync(`cd ./${name} && git init`);
    this.cp.execSync(`cd ./${name} && git add .`);
    this.cp.execSync(`cd ./${name} && git commit -m "Scaffold ${name} with fyord cli"`);
  }
}
