import * as child_process from 'child_process';
import { AsyncCommand, Result } from 'tsbase';
import { FileSystemExtraAdapter, IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { IOperation } from '../operation';
import { UpdateTextInFile, updateTextInFile as _updateTextInFile } from '../../utility/updateTextInFile';
import { CargoTomlTemplate, GreetTemplate, LibTemplate, ModTemplate, UtilsTemplate } from './templates/module';

type Replacement = {
  filePath: string;
  oldValue: string;
  newValue: string;
};

const packageJsonPath = './package.json';

export class WasmInit implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = FileSystemExtraAdapter,
    private cp: any = child_process,
    private updateTextInFile: UpdateTextInFile = _updateTextInFile) { }

  public Execute(): Promise<Result> {
    return new AsyncCommand(async () => {
      if (await this.fse.pathExists(packageJsonPath)) {
        await this.updateFilesWhereChangesNeeded();
        await this.scaffoldNewFiles();

        this.cp.execSync('npm i');
        this.cp.execSync('npm run build');
      } else {
        throw new Error('This command must be executed at the root of a fyord project (directory with package.json).');
      }
    }).Execute();
  }

  private async updateFilesWhereChangesNeeded() {
    const replacements: Replacement[] = [
      {
        filePath: './.gitignore', oldValue: '.vscode', newValue: `.vscode
target
pkg`
      },
      {
        filePath: packageJsonPath,
        oldValue: `"build": "webpack --config webpack.prod.js",
    "start": "webpack serve --config webpack.dev.js",`,
        newValue: ` "build-rust": "wasm-pack build",
    "build": "npm run build-rust && webpack --config webpack.prod.js",
    "start": "npm run build-rust && webpack serve --config webpack.dev.js",`
      },
      {
        filePath: packageJsonPath,
        oldValue: '"devDependencies": {',
        newValue: `"devDependencies": {
    "wasm-pack": "^0.10.0",`
      },
      {
        filePath: './src/index.html',
        oldValue: '<meta http-equiv="Content-Security-Policy" content="',
        newValue: `<meta http-equiv="Content-Security-Policy" content="
      script-src 'self' 'unsafe-eval';`
      },
      {
        filePath: './src/index.ts',
        oldValue: '})();',
        newValue: `
  const wasm = await import('../pkg/rust');
  wasm.greet();
})();`
      }
    ];

    for (const replacement of replacements) {
      await this.updateTextInFile(replacement.filePath, replacement.oldValue, replacement.newValue);
    }
  }

  private async scaffoldNewFiles() {
    const filesToCreate: { filePath: string; template: string; }[] = [
      { filePath: './Cargo.toml', template: CargoTomlTemplate },
      { filePath: './src/lib.rs', template: LibTemplate },
      { filePath: './src/rust/greet.rs', template: GreetTemplate },
      { filePath: './src/rust/mod.rs', template: ModTemplate },
      { filePath: './src/rust/utils.rs', template: UtilsTemplate }
    ];

    for (const file of filesToCreate) {
      await this.fse.outputFile(file.filePath, file.template);
    }
  }
}
