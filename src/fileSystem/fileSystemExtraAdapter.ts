import * as fse from 'fs-extra';

export interface IFileSystemExtraAdapter {
  outputFile(filePath: string, content: string): Promise<void>;
  pathExists(filePath: string): Promise<boolean>;
}

export const FileSystemExtraAdapter: IFileSystemExtraAdapter = fse;

export const FileSystemExtraDryRunAdapter: IFileSystemExtraAdapter = {
  pathExists: FileSystemExtraAdapter.pathExists,
  outputFile: async (filePath: string, _content: string) =>
    console.log(`Write file - ${filePath}`)
};
