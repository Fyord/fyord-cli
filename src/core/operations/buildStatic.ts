import 'isomorphic-fetch';
import { AsyncCommand, HttpClient, Result } from 'tsbase';
import { DIModule } from '../../diModule';
import { IOperation } from './operation';
import { Directories, Errors } from '../../enums/module';

const publicDir = './public';
const staticTsConfig = `${Directories.Static}/tsconfig.json`;

export class BuildStaticOperation implements IOperation {
  constructor(
    private cp = DIModule.ChildProcess,
    private fse = DIModule.FileSystemExtraAdapter,
    private fs = DIModule.FileSystemAdapter
  ) { }

  public async Execute(_args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      if (await this.fse.pathExists(staticTsConfig)) {
        const processDirectory = process.cwd();
        this.cp.execSync(`./node_modules/typescript/bin/tsc -p ${staticTsConfig}`);

        const functionModules = this.getAllFiles(Directories.Static)
          .filter(f => f.endsWith('js'))
          .map(f => f.replace('.', processDirectory));

        for (const module of functionModules) {
          const { default: func } = await import(module);

          if (typeof func === 'function') {
            console.log(`Executing: ${module.replace(`${processDirectory}/static/`, '')}`);

            const httpClient = new HttpClient({}, fetch);
            const result = await func(httpClient);

            const moduleNameParts = module.split('.');
            const name = moduleNameParts[0]
              .replace(processDirectory, '')
              .replace(Directories.Static.replace('.', ''), publicDir.replace('.', ''));
            const extension = moduleNameParts[1];
            const outputFileName = `.${name}.${extension}`;

            console.log(`Outputting: ${outputFileName}`);
            this.fse.outputFile(outputFileName, result);
          } else {
            throw new Error(`${module} does not export a "default" function.`);
          }
        }
      } else {
        console.warn(`"${staticTsConfig}" not found. Aborting operation.
${Errors.NotInRoot}`);
      }
    }).Execute();
  }

  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = this.fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles;

    files.forEach((file) => {
      if (this.fs.statSync(dirPath + '/' + file).isDirectory()) {
        arrayOfFiles = this.getAllFiles(dirPath + '/' + file, arrayOfFiles);
      } else {
        arrayOfFiles.push(`${dirPath}/${file}`);
      }
    });

    return arrayOfFiles;
  }
}
