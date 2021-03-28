import { IFileSystemAdapter, Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/module';
import { PageGenerator } from '../pageGenerator';

describe('PageGenerator', () => {
  let classUnderTest: PageGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();
  const mockFileSystem = new Mock<IFileSystemAdapter>();

  beforeEach(() => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), true);
    mockFileSystemExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    mockFileSystem.Setup(fs => fs.readFileSync(Strings.Empty, 'utf8'), new Buffer(''));

    classUnderTest = new PageGenerator(mockFileSystemExtra.Object, mockFileSystem.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should only generate files when pages module is not available', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), false);
    await classUnderTest.Generate(['name']);
    mockFileSystem.Verify(fs => fs.readFileSync(Strings.Empty, 'utf8'), 0);
    mockFileSystemExtra.Verify(fse => fse.pathExists(Strings.Empty), 1);
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 3);
  });

  it('should generate files and update pages module when available', async () => {
    await classUnderTest.Generate(['name']);
    mockFileSystem.Verify(fs => fs.readFileSync(Strings.Empty, 'utf8'), 1);
    mockFileSystemExtra.Verify(fse => fse.pathExists(Strings.Empty), 1);
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 4);
  });
});
