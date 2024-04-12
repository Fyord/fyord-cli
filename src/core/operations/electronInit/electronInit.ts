/* eslint-disable max-lines */
import { AsyncCommand, Result, Strings } from 'tsbase';
import { DIModule } from '../../../diModule';
import { Commands, Directories } from '../../../enums/module';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { TextReplacement } from '../../../types/module';
import {
  addEsbuildCommand as _addEsbuildCommand,
  EsbuildModes,
  EsbuildTypes,
  installDependencyIfNotInstalled,
  updateTextInFile,
  UpdateTextInFile
} from '../../utility/module';
import { IOperation } from '../operation';
import { ElectronMain, ElectronPreload, ElectronRenderer, Routes } from './templates/module';

export class ElectronInitOperation implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private installDependencyIfNotInstalledFunc = installDependencyIfNotInstalled,
    private updateTextInFileFunc: UpdateTextInFile = updateTextInFile,
    private fs = DIModule.FileSystemAdapter,
    private addEsbuildCommand = _addEsbuildCommand
  ) { }

  public Execute(): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      const inRootDir = await this.fse.pathExists(Directories.RootPackage);

      if (inRootDir) {
        await this.installDependencyIfNotInstalledFunc(Directories.Electron, Commands.InstallElectron);
        await this.installDependencyIfNotInstalledFunc(Directories.ElectronPackager, Commands.InstallElectronPackager);
        this.addEsbuildCommand(Commands.ElectronServe, EsbuildTypes.OnEnd, EsbuildModes.Dev);
        await this.updateFilesWhereChangesNeeded();
        await this.scaffoldNewFiles();
        this.deleteFiles();
      }
    }).Execute();
  }

  private async updateFilesWhereChangesNeeded() {
    const notFoundPage = './src/pages/not-found/not-found.tsx';
    const notFoundPageSpec = './src/pages/not-found/not-found.spec.tsx';
    const welcomePage = './src/pages/welcome/welcome.tsx';

    const replacements: TextReplacement[] = [
      {
        filePath: Directories.HtmlIndex,
        oldValue: '<base href="/">',
        newValue: '<base href="./">'
      },
      {
        filePath: Directories.HtmlIndex,
        oldValue: 'fonts.googleapis.com;',
        newValue: 'https://fonts.googleapis.com;'
      },
      {
        filePath: Directories.WebManifest,
        oldValue: '"start_url": "/",',
        newValue: '"start_url": "./",'
      },
      {
        filePath: Directories.EsbuildBuild,
        oldValue: "const browserEntryPoints = ['src/index.ts', 'src/service-worker.ts'];",
        newValue: "const browserEntryPoints = ['src/index.ts'];"
      },
      {
        filePath: Directories.EsbuildBuild,
        oldValue: 'const nodeEntryPoints = [];',
        newValue: "const nodeEntryPoints = ['src/electron/main.ts', 'src/electron/preload.ts', 'src/electron/renderer.ts']"
      },
      {
        filePath: Directories.TsIndex,
        oldValue: /if (navigator.serviceWorker) {\s*await navigator.serviceWorker.register(\s*'\/service-worker.js', { scope: '\/' });\s*}/,
        newValue: Strings.Empty
      },
      {
        filePath: notFoundPageSpec,
        oldValue: 'const route = { path: \'fake%20page\' } as Route;',
        newValue: 'const route = { href: \'fake%20page\' } as Route;'
      },
      {
        filePath: notFoundPage,
        oldValue: 'import { ParseJsx, Page, RenderModes, Route } from \'fyord\';',
        newValue: `import { ParseJsx, Page, RenderModes, Route, Asap } from 'fyord';
import { baseUrl, Routes } from '../../routes';`
      },
      {
        filePath: notFoundPage,
        oldValue: 'Route = async () => true;',
        newValue: `Route = async (route?: Route) => {
    this.recoverFromNonReLoadableState(route);
    return true;
  };`
      },
      {
        filePath: notFoundPage,
        // eslint-disable-next-line max-len
        oldValue: /<p>Could not find content matching, "{decodeURI(route?.path || '')}"<\/p>\s*<p>Please check spelling. Otherwise the resource may have been moved.<\/p>\s*<\/div>;\s*}/,
        newValue: `<p>Could not find content matching, "{decodeURI(route?.href || '')}"</p>
      <p>Please check spelling. Otherwise the resource may have been moved.</p>
    </div>;
  }

  private recoverFromNonReLoadableState(route?: Route) {
    Asap(() => {
      if (!location.href.includes(baseUrl)) {
        location.href = \`\${Routes.NotFound\}?originalRoute=\${route?.href\}\`;
      }
    });
  }`
      },
      {
        filePath: welcomePage,
        oldValue: 'import { ParseJsx, Page, Route } from \'fyord\';',
        newValue: `import { ParseJsx, Page, Route } from 'fyord';
import { Routes } from '../../routes';`
      },
      {
        filePath: welcomePage,
        oldValue: 'Route = async (route: Route) => route.path === document.baseURI.split(location.origin)[1];',
        newValue: 'Route = async (route: Route) => route.href === Routes.Home;'
      }
    ];

    for (const replacement of replacements) {
      await this.updateTextInFileFunc(replacement.filePath, replacement.oldValue, replacement.newValue);
    }
  }

  private async scaffoldNewFiles() {
    const filesToCreate: { filePath: string; template: string; }[] = [
      { filePath: './src/electron/main.ts', template: ElectronMain },
      { filePath: './src/electron/preload.ts', template: ElectronPreload },
      { filePath: './src/electron/renderer.ts', template: ElectronRenderer },
      { filePath: './src/routes.ts', template: Routes }
    ];

    for (const file of filesToCreate) {
      await this.fse.outputFile(file.filePath, file.template);
    }
  }

  private deleteFiles() {
    const paths = [
      './src/service-worker.ts'
    ];

    paths.forEach(path => {
      this.fs.rmSync(path);
    });
  }
}
