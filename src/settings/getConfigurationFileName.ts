import { IFileSystemAdapter } from 'tsbase';
import { FileSystemAdapter } from '../fileSystem/fileSystemAdapter';
import { ConfigurationFileName } from '../core/constants';

export const GetConfigurationFileName = (fs: IFileSystemAdapter = FileSystemAdapter): string => {
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
