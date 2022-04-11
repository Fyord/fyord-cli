import * as child_process from 'child_process';
import { IFileSystemAdapter } from 'tsbase';
import { FileSystemAdapter, FileSystemDryRunAdapter } from './fileSystem/fileSystemAdapter';
import { FileSystemExtraAdapter, FileSystemExtraDryRunAdapter, IFileSystemExtraAdapter } from './fileSystem/fileSystemExtraAdapter';

type DIModuleDependencies = {
  FileSystemAdapter: IFileSystemAdapter,
  FileSystemExtraAdapter: IFileSystemExtraAdapter,
  ChildProcess: typeof child_process
};

const liveModule: DIModuleDependencies = {
  FileSystemAdapter: FileSystemAdapter,
  FileSystemExtraAdapter: FileSystemExtraAdapter,
  ChildProcess: child_process
};

export const dryRunModule: DIModuleDependencies = {
  FileSystemAdapter: FileSystemDryRunAdapter,
  FileSystemExtraAdapter: FileSystemExtraDryRunAdapter,
  ChildProcess: {
    exec: (command: string, _callback: (stdErr: any) => void) =>
      console.log(`Execute command: ${command}`),
    execSync: (command: string) =>
      console.log(`Execute command: ${command}`)
  } as typeof child_process
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
