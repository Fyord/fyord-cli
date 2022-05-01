import { Mock, Times } from 'tsmockit';
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

    mockFsAdapter.Setup(f => f.readFileSync('', '' as any), fileContentsResponse);
    mockFseAdapter.Setup(f => f.outputFile('', ''));
    mockFsAdapter.Setup(f => f.readFileSync(Directories.WebpackCommon, 'utf8' as any), fileContentsResponse);
  });

  it('should read file contents and output file when webpack does NOT include webpack shell plugin', () => {
    mockFseAdapter.Setup(f => f.outputFile(Directories.WebpackCommon, `${requireWebpackShellPlugin}plugins: [
      new WebpackShellPlugin({
        onBuildStart: [
          '${Commands.InstallWasmPack}'
        ]
      }),`));

    addWebpackOnBuildStartCommand(
      Commands.InstallWasmPack,
      mockFsAdapter.Object,
      mockFseAdapter.Object);

    mockFsAdapter.Verify(f => f.readFileSync(Directories.WebpackCommon, 'utf8' as any), Times.Once);
    mockFseAdapter.Verify(f => f.outputFile(Directories.WebpackCommon, `${requireWebpackShellPlugin}plugins: [
      new WebpackShellPlugin({
        onBuildStart: [
          '${Commands.InstallWasmPack}'
        ]
      }),`), Times.Once);
  });

  it('should read file contents and output file when webpack DOES include webpack shell plugin', () => {
    fileContentsResponse = `${requireWebpackShellPlugin}\nplugins: [`;
    mockFsAdapter.Setup(f => f.readFileSync(Directories.WebpackCommon, 'utf8' as any), fileContentsResponse);
    mockFseAdapter.Setup(f => f.outputFile(Directories.WebpackCommon, `${requireWebpackShellPlugin}plugins: [
      new WebpackShellPlugin({
        onBuildStart: [
          '${Commands.InstallWasmPack}'
        ]
      }),`));

    addWebpackOnBuildStartCommand(
      Commands.InstallWasmPack,
      mockFsAdapter.Object,
      mockFseAdapter.Object);

    mockFsAdapter.Verify(f => f.readFileSync(Directories.WebpackCommon, 'utf8' as any), Times.Once);
    mockFseAdapter.Verify(f => f.outputFile(Directories.WebpackCommon, `${requireWebpackShellPlugin}plugins: [
      new WebpackShellPlugin({
        onBuildStart: [
          '${Commands.InstallWasmPack}'
        ]
      }),`), Times.Once);
  });
});
