import { Any, Mock, Times } from 'tsmockit';
import { Commands } from '../../../enums/commands';
import { Directories } from '../../../enums/directories';
import { FileSystemAdapter } from '../../../fileSystem/fileSystemAdapter';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { addWebpackOnBuildStartCommand, requireWebpackShellPlugin } from '../addWebpackOnBuildStartCommand';

describe('addWebpackOnBuildStartCommand', () => {
  const mockFsAdapter = new Mock<typeof FileSystemAdapter>();
  const mockFseAdapter = new Mock<IFileSystemExtraAdapter>();

  let fileContentsResponse: string;

  beforeEach(() => {
    fileContentsResponse = 'plugins: [';

    mockFsAdapter.Setup(f => f.readFileSync(Any<string>(), Any<any>()), fileContentsResponse);
    mockFsAdapter.Setup(f => f.readFileSync(Directories.WebpackCommon, 'utf8' as any), fileContentsResponse);
  });

  it('should read file contents and output file when webpack does NOT include webpack shell plugin', () => {
    // eslint-disable-next-line max-len
    const expectedContents = "const WebpackShellPlugin = require('webpack-shell-plugin');\nplugins: [\n    new WebpackShellPlugin({\n      onBuildStart: [\n        'npm install --save-dev wasm-pack@^0.10.2'\n      ]\n    }),";
    mockFseAdapter.Setup(f => f.outputFile(Directories.WebpackCommon, expectedContents));

    addWebpackOnBuildStartCommand(
      Commands.InstallWasmPack,
      mockFsAdapter.Object,
      mockFseAdapter.Object);

    mockFsAdapter.Verify(f => f.readFileSync(Directories.WebpackCommon, 'utf8' as any), Times.Once);
    mockFseAdapter.Verify(f => f.outputFile(Directories.WebpackCommon, expectedContents), Times.Once);
  });

  it('should read file contents and output file when webpack DOES include webpack shell plugin', () => {
    const expectedContents = "const WebpackShellPlugin = require('webpack-shell-plugin');\nplugins: [";
    fileContentsResponse = `${requireWebpackShellPlugin}\nplugins: [`;
    mockFsAdapter.Setup(f => f.readFileSync(Directories.WebpackCommon, 'utf8' as any), fileContentsResponse);
    mockFseAdapter.Setup(f => f.outputFile(Directories.WebpackCommon, expectedContents));

    addWebpackOnBuildStartCommand(
      Commands.InstallWasmPack,
      mockFsAdapter.Object,
      mockFseAdapter.Object);

    mockFsAdapter.Verify(f => f.readFileSync(Directories.WebpackCommon, 'utf8' as any), Times.Once);
    mockFseAdapter.Verify(f => f.outputFile(Directories.WebpackCommon, expectedContents), Times.Once);
  });
});
