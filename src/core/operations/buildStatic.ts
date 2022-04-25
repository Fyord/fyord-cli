import { AsyncCommand, Result } from 'tsbase';
import * as child_process from 'child_process';
import { DIModule } from '../../diModule';
import { IOperation } from './operation';

const staticTsConfig = './static/tsconfig.json';

export class BuildStaticOperation implements IOperation {
  constructor(
    private cp: typeof child_process = DIModule.ChildProcess,
    private fse = DIModule.FileSystemExtraAdapter,
    private fs = DIModule.FileSystemAdapter
  ) { }

  public async Execute(_args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      if (await this.fse.pathExists(staticTsConfig)) {
        this.cp.execSync(`./node_modules/typescript/bin/tsc -p ${staticTsConfig}`);
      } else {
        console.warn(`"${staticTsConfig}" not found. Aborting operation.`);
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
