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
  OnStart,
  /**
   * Happens at the end of each build (including builds triggered in watch mode)
   */
  OnEnd
}

export enum EsbuildModes {
  Dev,
  Production,
  All
}

enum Constants {
  BeforeOperationsPath = './esbuild/beforeOperations.ts',
  BeforeOperationsDeclaration = 'export const beforeOperations: BuildOperation[] = [',
  OnStartOperationsPath = './esbuild/onStartOperations.ts',
  OnStartOperationsDeclaration = 'export const onBuildStartOperations: BuildOperation[] = [',
  OnEndOperationsPath = './esbuild/onEndOperations.ts',
  OnEndOperationsDeclaration = 'export const onBuildEndOperations: BuildOperation[] = [',
  ChildProcessImport = "import * as child_process from 'child_process';",
  Exec = 'exec',
  ExecSync = 'execSync'
}

const DeclarationRecord: Record<EsbuildTypes, Constants> = {
  [EsbuildTypes.Before]: Constants.BeforeOperationsDeclaration,
  [EsbuildTypes.OnStart]: Constants.OnStartOperationsDeclaration,
  [EsbuildTypes.OnEnd]: Constants.OnEndOperationsDeclaration
};

const PathRecord: Record<EsbuildTypes, Constants> = {
  [EsbuildTypes.Before]: Constants.BeforeOperationsPath,
  [EsbuildTypes.OnStart]: Constants.OnStartOperationsPath,
  [EsbuildTypes.OnEnd]: Constants.OnEndOperationsPath
};

const ExecCommandRecord: Record<EsbuildTypes, Constants> = {
  [EsbuildTypes.Before]: Constants.ExecSync,
  [EsbuildTypes.OnStart]: Constants.Exec,
  [EsbuildTypes.OnEnd]: Constants.Exec
};

const ModeCommandRecord: Record<EsbuildModes, (execCommand: Constants, command: string) => string> = {
  [EsbuildModes.Dev]: (execCommand, command) =>
    `{ if (!isProduction) { child_process.${execCommand}('${command}'); } }`,
  [EsbuildModes.Production]: (execCommand, command) =>
    `{ if (isProduction) { child_process.${execCommand}('${command}'); } }`,
  [EsbuildModes.All]: (execCommand, command) =>
    `child_process.${execCommand}('${command}')`
};

export const addEsbuildCommand = (
  command: Commands,
  type: EsbuildTypes,
  mode = EsbuildModes.All,
  fs = DIModule.FileSystemAdapter
): void => {
  const path = PathRecord[type];
  const lineToReplace = DeclarationRecord[type];
  const lineToAdd = `${lineToReplace}
  (${mode === EsbuildModes.All ? '' : 'isProduction'}) => ${ModeCommandRecord[mode](ExecCommandRecord[type], command)},`;

  const originalFileContents = fs.readFileSync(path).toString();
  const newFileContentsWithImport = originalFileContents.includes(Constants.ChildProcessImport) ?
    originalFileContents : `${Constants.ChildProcessImport}\n${originalFileContents}`;
  fs.writeFileSync(path, newFileContentsWithImport.replace(lineToReplace, lineToAdd));
};
