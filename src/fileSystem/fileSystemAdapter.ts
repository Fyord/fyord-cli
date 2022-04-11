import * as fs from 'fs';
import { IFileSystemAdapter } from 'tsbase/Persistence/Repository/Persisters/FSPersister/IFileSystemAdapter';

export const FileSystemAdapter: IFileSystemAdapter = fs;

export const FileSystemDryRunAdapter: IFileSystemAdapter & {
  rmdirSync: typeof fs.rmdirSync,
  renameSync: typeof fs.renameSync
} = {
  accessSync: FileSystemAdapter.accessSync,
  constants: FileSystemAdapter.constants,
  existsSync: FileSystemAdapter.existsSync,
  mkdirSync: (path: string) =>
    console.log(`Create directory - "${path}"`),
  readFileSync: FileSystemAdapter.readFileSync,
  writeFileSync: (path: string, _data: string) =>
    console.log(`Write file - "${path}"`),
  rmdirSync: (path: any, _options: any) =>
    console.log(`Remove directory - ${path}`),
  renameSync: (oldPath: any, newPath: any) =>
    console.log(`Rename ${oldPath} to ${newPath}`)
};
