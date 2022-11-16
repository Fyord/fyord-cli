import { AsyncCommand, Result } from 'tsbase';
import { DIModule } from '../../../diModule';
import { Commands, Directories } from '../../../enums/module';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { TextReplacement } from '../../../types/module';
import { installDependencyIfNotInstalled, updateTextInFile, UpdateTextInFile } from '../../utility/module';
import { IOperation } from '../operation';
import { ElectronMain, ElectronPreload, ElectronRenderer } from './templates/module';

export class ElectronInitOperation implements IOperation {
  constructor(
    private fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
    private installDependencyIfNotInstalledFunc = installDependencyIfNotInstalled,
    private updateTextInFileFunc: UpdateTextInFile = updateTextInFile
  ) { }

  public Execute(): Promise<Result<null>> {
    return new AsyncCommand(async () => {
      const inRootDir = await this.fse.pathExists(Directories.RootPackage);

      if (inRootDir) {
        await this.installDependencyIfNotInstalledFunc(Directories.WebpackShellPlugin, Commands.InstallWebpackShellPlugin);
        await this.installDependencyIfNotInstalledFunc(Directories.WebpackShellPlugin, Commands.InstallElectron);
        await this.installDependencyIfNotInstalledFunc(Directories.WebpackShellPlugin, Commands.InstallElectronPackager);

        await this.updateFilesWhereChangesNeeded();
        await this.scaffoldNewFiles();
      }
    }).Execute();
  }

  private async updateFilesWhereChangesNeeded() {
    const replacements: TextReplacement[] = [
      {
        filePath: Directories.RootPackage,
        oldValue: '"start": "webpack serve --config webpack.dev.js"',
        newValue: '"start": "webpack -w --config webpack.dev.js"'
      },
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
        filePath: Directories.WebpackCommon,
        oldValue: '\'service-worker\': \'./src/service-worker.ts\'',
        newValue: ''
      },
      {
        filePath: Directories.WebpackCommon,
        oldValue: `devServer: {
    contentBase: './public',
    compress: true,
    port: 4200,
    historyApiFallback: {
      disableDotRule: true
    }
  }`,
        newValue: ''
      },
      {
        filePath: Directories.WebpackDev,
        oldValue: 'const common = require(\'./webpack.common.js\');',
        newValue: `const common = require('./webpack.common.js');
const WebpackShellPlugin = require('webpack-shell-plugin');`
      },
      {
        filePath: Directories.WebpackDev,
        oldValue: 'devtool: \'inline-source-map\'',
        newValue: `devtool: 'inline-source-map',
  plugins: [
    new WebpackShellPlugin({
      onBuildStart: [
        'tsc -w ./src/electron/main.ts --outDir ./public',
        'tsc -w ./src/electron/preload.ts --outDir ./public',
        'tsc -w ./src/electron/renderer.ts --outDir ./public'
      ],
      onBuildEnd: [
        'electron public/main.js'
      ]
    })
  ]`
      },
      {
        filePath: Directories.WebpackProd,
        oldValue: 'const HtmlWebpackPlugin = require(\'html-webpack-plugin\');',
        newValue: `const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');`
      },
      {
        filePath: Directories.WebpackProd,
        oldValue: `new HtmlWebpackPlugin({
    template: 'src/index.html',
    hash: true
  }),`,
        newValue: `new HtmlWebpackPlugin({
    template: 'src/index.html',
    hash: true
  }),
  new WebpackShellPlugin({
    onBuildStart: [
      'tsc src/electron/main.ts --outDir ./public',
      'tsc src/electron/preload.ts --outDir ./public',
      'tsc src/electron/renderer.ts --outDir ./public'
    ]
  })`
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
      { filePath: './src/electron/renderer.ts', template: ElectronRenderer }
    ];

    for (const file of filesToCreate) {
      await this.fse.outputFile(file.filePath, file.template);
    }
  }
}
