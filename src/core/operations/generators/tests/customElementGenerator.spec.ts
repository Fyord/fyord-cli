import { Mock } from 'tsmockit';
import { IFileSystemAdapter, Strings } from 'tsbase';
import { setupSettingsServiceForTesting } from '../../../../tests/setupSettingsServiceForTesting.spec';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/fileSystemExtraAdapter';
import { CustomElementGenerator } from '../customElementGenerator';

describe('CustomElementGenerator', () => {
  let classUnderTest: CustomElementGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();
  const mockFileSystem = new Mock<IFileSystemAdapter>();

  beforeAll(() => {
    setupSettingsServiceForTesting();
  });

  beforeEach(() => {
    spyOn(console, 'log');
    mockFileSystemExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), true);
    mockFileSystem.Setup(fs => fs.readFileSync(Strings.Empty, 'utf8'), Buffer.from(Strings.Empty, 'utf8'));

    classUnderTest = new CustomElementGenerator(mockFileSystemExtra.Object, mockFileSystem.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should just generate files when given name and selector args', async () => {
    const result = await classUnderTest.Generate(['name', 'selector']);

    expect(result.IsSuccess).toBeTruthy();
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 4);
  });

  it('should not generate files when not given name and selector args', async () => {
    const result = await classUnderTest.Generate(['name']);

    expect(result.IsSuccess).toBeFalsy();
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 0);
  });
});
