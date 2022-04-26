import * as child_process from 'child_process';
import * as fs from 'fs';
import { ChildProcessAdapter } from './fileSystem/childProcessAdapter';
import { FileSystemAdapter, FileSystemDryRunAdapter } from './fileSystem/fileSystemAdapter';
import { FileSystemExtraAdapter, FileSystemExtraDryRunAdapter, IFileSystemExtraAdapter } from './fileSystem/fileSystemExtraAdapter';

type DIModuleDependencies = {
  FileSystemAdapter: typeof fs,
  FileSystemExtraAdapter: IFileSystemExtraAdapter,
  ChildProcess: ChildProcessAdapter
};

const liveModule: DIModuleDependencies = {
  FileSystemAdapter: FileSystemAdapter,
  FileSystemExtraAdapter: FileSystemExtraAdapter,
  ChildProcess: child_process as ChildProcessAdapter
};

export const dryRunModule: DIModuleDependencies = {
  FileSystemAdapter: FileSystemDryRunAdapter as typeof fs,
  FileSystemExtraAdapter: FileSystemExtraDryRunAdapter,
  ChildProcess: {
    exec: (command: string, _callback: (stdErr: any) => void) =>
      console.log(`Execute command: ${command}`),
    execSync: (command: string) =>
      console.log(`Execute command: ${command}`)
  } as ChildProcessAdapter
};

export const dryRunKey = 'dry-run';

export class DIModule {
  public static DryRunMode = false;

  public static get FileSystemAdapter() {
    return DIModule.DryRunMode ?
      dryRunModule.FileSystemAdapter :
      liveModule.FileSystemAdapter;
  }

  public static get FileSystemExtraAdapter() {
    return DIModule.DryRunMode ?
      dryRunModule.FileSystemExtraAdapter :
      liveModule.FileSystemExtraAdapter;
  }

  public static get ChildProcess() {
    return DIModule.DryRunMode ?
      dryRunModule.ChildProcess :
      liveModule.ChildProcess;
  }
}

if (process.argv.includes(dryRunKey)) {
  DIModule.DryRunMode = true;
}
