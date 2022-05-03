import { DIModule } from '../../diModule';

export const getAllFiles = (
  dirPath: string,
  arrayOfFiles: string[] = [],
  fs = DIModule.FileSystemAdapter
) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles, fs);
    } else {
      arrayOfFiles.push(`${dirPath}/${file}`);
    }
  });

  return arrayOfFiles;
};
