import { DIModule } from '../../diModule';
import { Directories, Commands } from '../../enums/module';

export const addWebpackOnBuildStartCommand = (
  command: Commands,
  fs = DIModule.FileSystemAdapter,
  fse = DIModule.FileSystemExtraAdapter
) => {
  const requireWebpackShellPlugin = 'const WebpackShellPlugin = require(\'webpack-shell-plugin\');';
  let webpackCommonContents = fs.readFileSync(Directories.WebpackCommon, 'utf8').toString();

  if (!webpackCommonContents.includes(requireWebpackShellPlugin)) {
    webpackCommonContents = `${requireWebpackShellPlugin}\n${webpackCommonContents}`;
    webpackCommonContents = webpackCommonContents.replace('plugins: [', `plugins: [
    new WebpackShellPlugin({
      onBuildStart: [
        '${command}'
      ]
    }),`);
  } else if (!webpackCommonContents.includes(command)) {
    webpackCommonContents = webpackCommonContents.replace('onBuildStart: [', `onBuildStart: [
        '${command}',`);
  }

  fse.outputFile(Directories.WebpackCommon, webpackCommonContents);
};
