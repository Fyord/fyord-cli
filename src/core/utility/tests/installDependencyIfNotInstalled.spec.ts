import { Mock, Times } from 'tsmockit';
import { DIModule } from '../../../diModule';
import { Commands } from '../../../enums/commands';
import { Directories } from '../../../enums/directories';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { installDependencyIfNotInstalled } from '../installDependencyIfNotInstalled';

describe('installDependencyIfNotInstalled', () => {
  const mockFseAdapter = new Mock<IFileSystemExtraAdapter>();
  const mockChildProcess = new Mock<typeof DIModule['ChildProcess']>();

  beforeEach(() => {
    mockFseAdapter.Setup(f => f.pathExists(''), false);
    mockChildProcess.Setup(c => c.execSync(''));
  });

  it('should install dependency when NOT already installed', async () => {
    await installDependencyIfNotInstalled(
      Directories.WebpackShellPlugin,
      Commands.InstallWebpackShellPlugin,
      mockFseAdapter.Object,
      mockChildProcess.Object);

    mockFseAdapter.Verify(f => f.pathExists(''), Times.Once);
    mockChildProcess.Verify(c => c.execSync(''), Times.Once);
  });

  it('should NOT install dependency when already installed', async () => {
    const consoleSpy = spyOn(console, 'log');
    mockFseAdapter.Setup(f => f.pathExists(''), true);

    await installDependencyIfNotInstalled(
      Directories.WebpackShellPlugin,
      Commands.InstallWebpackShellPlugin,
      mockFseAdapter.Object,
      mockChildProcess.Object);

    mockFseAdapter.Verify(f => f.pathExists(''), Times.Once);
    mockChildProcess.Verify(c => c.execSync(''), Times.Never);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Skipping "${Commands.InstallWebpackShellPlugin}" as "${Directories.WebpackShellPlugin}" already exists.`)
  });
});
