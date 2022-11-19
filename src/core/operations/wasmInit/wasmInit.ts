import { AsyncCommand, Result } from 'tsbase';
import { Commands, Directories, Errors } from '../../../enums/module';
import { TextReplacement } from '../../../types/module';
import { IFileSystemExtraAdapter } from '../../../fileSystem/module';
import { DIModule } from '../../../diModule';
import {
  addWebpackOnBuildStartCommand,
  UpdateTextInFile,
  updateTextInFile as _updateTextInFile,
  installDependencyIfNotInstalled
} from '../../utility/module';
import { IOperation } from '../operation';
import { RustTsTemplate, CargoTomlTemplate, GreetTemplate, LibTemplate, ModTemplate, UtilsTemplate } from './templates/module';

export class WasmInit implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private updateTextInFile: UpdateTextInFile = _updateTextInFile,
    private installDependencyIfNotInstalledFunc = installDependencyIfNotInstalled,
    private addWebpackOnBuildStartCommandFunc = addWebpackOnBuildStartCommand
  ) { }

  public Execute(): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      const inRootDir = await this.fse.pathExists(Directories.RootPackage);
      const cargoLockAlreadyExists = await this.fse.pathExists(Directories.CargoLock);

      if (inRootDir && !cargoLockAlreadyExists) {
        await this.installDependencyIfNotInstalledFunc(Directories.WebpackShellPlugin, Commands.InstallWebpackShellPlugin);
        await this.installDependencyIfNotInstalledFunc(Directories.WasmPack, Commands.InstallWasmPack);
        this.addWebpackOnBuildStartCommandFunc(Commands.WasmPackBuild);
        await this.updateFilesWhereChangesNeeded();
        await this.scaffoldNewFiles();
      } else {
        throw new Error(cargoLockAlreadyExists ? 'This project already ran the "wasmInit" command.' : Errors.NotInRoot);
      }
    }).Execute();
  }

  private async updateFilesWhereChangesNeeded() {
    const replacements: TextReplacement[] = [
      {
        filePath: Directories.Gitignore, oldValue: '.vscode', newValue: `.vscode
target
pkg`
      },
      {
        filePath: './src/index.html',
        oldValue: '<meta http-equiv="Content-Security-Policy" content="',
        newValue: `<meta http-equiv="Content-Security-Policy" content="
      script-src 'self' 'unsafe-eval';`
      },
      {
        filePath: './src/index.ts',
        oldValue: 'import { defaultLayout } from \'./layouts\';',
        newValue: `import { defaultLayout } from './layouts';
import { RustWindowKey, Rust } from './rust/rust';`
      },
      {
        filePath: './src/index.ts',
        oldValue: '})();',
        newValue: `
  window[RustWindowKey] = await import('../pkg/rust');
  Rust()?.greet();
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
      { filePath: './src/rust/utils.rs', template: UtilsTemplate },
      { filePath: './src/rust/rust.ts', template: RustTsTemplate }
    ];

    for (const file of filesToCreate) {
      await this.fse.outputFile(file.filePath, file.template);
    }
  }
}
