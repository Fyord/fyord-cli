import { IFileSystemAdapter } from 'tsbase';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';

export const updateModuleExports = async (
  fse: IFileSystemExtraAdapter,
  fs: IFileSystemAdapter,
  pascalCaseName: string,
  camelCaseName: string
) => {
  const moduleFile = './module.ts';
  if (await fse.pathExists(moduleFile)) {
    let moduleContents = fs.readFileSync(moduleFile, 'utf8').toString();
    moduleContents = `export * from './${camelCaseName}/${camelCaseName}';
${moduleContents}`;

    await fse.outputFile(moduleFile, moduleContents);
  }
};
