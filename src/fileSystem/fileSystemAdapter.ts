import * as fs from 'fs';

export const FileSystemAdapter = fs;

export const FileSystemDryRunAdapter = {
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
  rmSync: (path: any, _options: any) =>
    console.log(`Remove file - ${path}`),
  renameSync: (oldPath: any, newPath: any) =>
    console.log(`Rename ${oldPath} to ${newPath}`),
  readdirSync: FileSystemAdapter.readdirSync,
  statSync: FileSystemAdapter.statSync
};
