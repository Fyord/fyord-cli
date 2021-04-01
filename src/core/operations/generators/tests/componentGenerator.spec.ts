import { IFileSystemAdapter, Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/module';
import { ComponentGenerator } from '../componentGenerator';

describe('ComponentGenerator', () => {
  let classUnderTest: ComponentGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();
  const mockFileSystem = new Mock<IFileSystemAdapter>();

  beforeEach(() => {
    mockFileSystemExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    mockFileSystem.Setup(fs => fs.readFileSync(Strings.Empty, 'utf8'), Buffer.from(Strings.Empty, 'utf8'));

    classUnderTest = new ComponentGenerator(mockFileSystemExtra.Object, mockFileSystem.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should just generate files when module not present', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), false);

    await classUnderTest.Generate(['name']);
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 3);
  });

  it('should generate files and update module when module present', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), true);

    await classUnderTest.Generate(['name']);
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 4);
  });
});
