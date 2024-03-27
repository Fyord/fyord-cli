import { AsyncCommand, Result } from 'tsbase';
import { IFileSystemExtraAdapter } from '../../fileSystem/module';
import { UpdateTextInFile, updateTextInFile as _updateTextInFile } from '../utility/updateTextInFile';
import { DIModule } from '../../diModule';
import { IOperation } from './operation';

const defaultName = 'fyord app';
enum StyleExtensions {
  Css = 'css',
  Scss = 'scss'
}

export class NewOperation implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private fs: any = DIModule.FileSystemAdapter,
    private cp: any = DIModule.ChildProcess,
    private updateTextInFile: UpdateTextInFile = _updateTextInFile) { }

  public async Execute(args: string[]): Promise<Result<null>> {
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
    this.cp.execSync(`git clone -b v.3.0.0 https://github.com/Fyord/fyord-boilerplate.git ./${name}`);
    this.fs.rmdirSync(`./${name}/.git`, { recursive: true });
    this.fs.rmdirSync(`./${name}/.github`, { recursive: true });
  }

  private async initializeSettingsWithPreferredFileExtension(name: string, preferredStyleExtension: StyleExtensions) {
    await this.fse.outputFile(`./${name}/fyord.json`, `{"settings":[{"key":"styleExtension","value":"${preferredStyleExtension}"}]}`);
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
      `./${name}/src/index.ts`,
      `./${name}/src/styles/base.${preferredStyleExtension}`,
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
