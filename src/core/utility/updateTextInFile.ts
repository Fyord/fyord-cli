import * as filesystem from 'fs';
import { DIModule } from '../../diModule';
import { IFileSystemExtraAdapter } from '../../fileSystem/module';

export type UpdateTextInFile = (
  fileName: string,
  oldText: string | RegExp,
  newText: string,
  fse?: IFileSystemExtraAdapter,
  fs?: any
) => Promise<void>;

export const updateTextInFile: UpdateTextInFile = async (
  fileName: string,
  oldText: string | RegExp,
  newText: string,
  fse: IFileSystemExtraAdapter = DIModule.FileSystemExtraAdapter,
  fs: any = filesystem
): Promise<void> => {
  if (await fse.pathExists(fileName)) {
    let fileContents = fs.readFileSync(fileName, 'utf8').toString();
    fileContents = fileContents.replace(oldText, newText);
    await fse.outputFile(fileName, fileContents);
  }
};
