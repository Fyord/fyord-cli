import { DIModule } from '../../diModule';

export const getAllFiles = (
  dirPath: string,
  arrayOfFiles: string[] = [],
  fs = DIModule.FileSystemAdapter
) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles;

  files.forEach((file) => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(`${dirPath}/${file}`);
    }
  });

  return arrayOfFiles;
};
