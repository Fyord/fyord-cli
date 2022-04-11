import { IFileSystemAdapter } from 'tsbase';
import { ConfigurationFileName } from '../core/constants';
import { DIModule } from '../diModule';

export const GetConfigurationFileName = (fs: IFileSystemAdapter = DIModule.FileSystemAdapter): string => {
  let depth = 0;
  let relativePath = './';

  while (!fs.existsSync(`${relativePath}${ConfigurationFileName}`)) {
    depth++;
    relativePath = depth === 1 ? '../' : `${relativePath}../`;

    if (depth === 11) {
      relativePath = './';
      break;
    }
  }

  return `${relativePath}${ConfigurationFileName}`;
};
