import 'isomorphic-fetch';
import { AsyncCommand, HttpClient, Result, Strings } from 'tsbase';
import { DIModule } from '../../diModule';
import { IOperation } from './operation';
import { Directories, Errors } from '../../enums/module';
import { getAllFiles } from '../utility/getAllFiles';

const publicDir = './public';
const staticTsConfig = `${Directories.Static}/tsconfig.json`;

export class BuildStaticOperation implements IOperation {
  constructor(
    private cp = DIModule.ChildProcess,
    private fse = DIModule.FileSystemExtraAdapter,
    private fs = DIModule.FileSystemAdapter,
    private mainProcess = process,
    private getAllFilesFunc = getAllFiles,
    private importFunc = async (path: string) => await import(path)
  ) { }

  public async Execute(_args: string[]): Promise<Result<null>> {
    return await new AsyncCommand(async () => {
      if (await this.fse.pathExists(staticTsConfig)) {
        const processDirectory = this.mainProcess.cwd();
        this.cp.execSync(`npx tsc -p ${staticTsConfig}`);

        const functionModules = this.getAllFilesFunc(Directories.Static)
          .filter(f => f.endsWith('js'))
          .map(f => f.replace('.', processDirectory));

        for (const module of functionModules) {
          const { default: func } = await this.importFunc(module);

          if (typeof func === 'function') {
            console.log(`Executing: ${module.replace(`${processDirectory}/static/`, Strings.Empty)}`);

            const httpClient = new HttpClient({}, fetch);
            const result = await func(httpClient);

            const moduleNameParts = module.split('.');
            const name = moduleNameParts[0]
              .replace(processDirectory, Strings.Empty)
              .replace(Directories.Static.replace('.', Strings.Empty), publicDir.replace('.', Strings.Empty));
            const extension = moduleNameParts[1];
            const outputFileName = `.${name}.${extension}`;

            console.log(`Outputting: ${outputFileName}`);
            this.fse.outputFile(outputFileName, result);
            this.fs.rmSync(module);
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
}
