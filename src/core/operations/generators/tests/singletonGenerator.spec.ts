import { Strings } from 'tsbase';
import { Any, Mock } from 'tsmockit';
import { FileSystemAdapter, IFileSystemExtraAdapter } from '../../../../fileSystem/module';
import { SingletonGenerator } from '../singletonGenerator';

describe('SingletonGenerator', () => {
  let classUnderTest: SingletonGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();
  const mockFileSystem = new Mock<typeof FileSystemAdapter>();

  beforeEach(() => {
    mockFileSystem.Setup(fs => fs.readFileSync(Any<string>(), 'utf8'), Buffer.from(Strings.Empty, 'utf8'));
    mockFileSystemExtra.Setup(fse => fse.outputFile(Any<string>(), Any<string>()));
    classUnderTest = new SingletonGenerator(mockFileSystemExtra.Object, mockFileSystem.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should just generate files when module not present', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Any<string>()), false);

    await classUnderTest.Generate(['name']);
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 2);
  });

  it('should generate files and update module when module present', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Any<string>()), true);

    await classUnderTest.Generate(['name']);
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 3);
  });
});
