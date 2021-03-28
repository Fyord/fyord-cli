import * as fse from 'fs-extra';

export interface IFileSystemExtraAdapter {
  outputFile(filePath: string, content: string): Promise<void>;
  pathExists(filePath: string): Promise<boolean>;
}

export const FileSystemExtraAdapter: IFileSystemExtraAdapter = fse;
