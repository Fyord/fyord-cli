import { Strings } from 'tsbase';
import { Mock, Times } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../fileSystem/fileSystemExtraAdapter';
import { updateTextInFile } from '../updateTextInFile';

describe('updateTextInFile', () => {
  const mockFsExtra = new Mock<IFileSystemExtraAdapter>();
  const mockFs = new Mock<any>();

  beforeEach(() => {
    mockFsExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    mockFs.Setup(fs => fs.readFileSync(Strings.Empty, 'utf8'), Buffer.from(Strings.Empty, 'utf8'));
  });

  it('should NOT read, replace, and output a file when it does NOT exist', async () => {
    mockFsExtra.Setup(fse => fse.pathExists(Strings.Empty), false);

    await updateTextInFile('filename', 'old', 'new', mockFsExtra.Object, mockFs.Object);

    mockFsExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), Times.Never);
    mockFs.Verify(fs => fs.readFileSync(Strings.Empty, 'utf8'), Times.Never);
  });

  it('should read, replace, and output a file when it exists', async () => {
    mockFsExtra.Setup(fse => fse.pathExists(Strings.Empty), true);

    await updateTextInFile('filename', 'old', 'new', mockFsExtra.Object, mockFs.Object);

    mockFsExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), Times.Once);
    mockFs.Verify(fs => fs.readFileSync(Strings.Empty, 'utf8'), Times.Once);
  });
});
