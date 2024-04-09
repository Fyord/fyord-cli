import { DIModule } from '../../diModule';
import { Commands } from '../../enums/commands';

export enum EsbuildTypes {
  /**
   * Happens once before the build starts
   */
  Before,
  /**
   * Happens on the start of each build (including builds triggered in watch mode)
   */
  OnStart
}

enum Constants {
  BeforeOperationsPath = './esbuild/beforeOperations.ts',
  BeforeOperationsDeclaration = 'export const beforeOperations: BuildOperation[] = [',
  OnStartOperationsPath = './esbuild/onStartOperations.ts',
  OnStartOperationsDeclaration = 'export const onBuildStartOperations: BuildOperation[] = [',
  ChildProcessImport = "import * as child_process from 'child_process';"
}

export const addEsbuildCommand = (
  command: Commands,
  type: EsbuildTypes,
  fs = DIModule.FileSystemAdapter
): void => {
  const path = type === EsbuildTypes.Before ? Constants.BeforeOperationsPath : Constants.OnStartOperationsPath;
  const lineToReplace = type === EsbuildTypes.Before ? Constants.BeforeOperationsDeclaration : Constants.OnStartOperationsDeclaration;
  const lineToAdd = `${lineToReplace}\n  () => child_process.${type === EsbuildTypes.Before ? 'execSync' : 'exec'}('${command}'),`;

  const originalFileContents = fs.readFileSync(path).toString();
  const newFileContentsWithImport = originalFileContents.includes(Constants.ChildProcessImport) ?
    originalFileContents : `${Constants.ChildProcessImport}\n${originalFileContents}`;
  fs.writeFileSync(path, newFileContentsWithImport.replace(lineToReplace, lineToAdd));
};
