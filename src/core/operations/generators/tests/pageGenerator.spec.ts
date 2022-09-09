import { Strings } from 'tsbase';
import { Any, Mock } from 'tsmockit';
import { FileSystemAdapter, IFileSystemExtraAdapter } from '../../../../fileSystem/module';
import { Settings } from '../../../../settings/settings';
import { ISettingsService } from '../../../../settings/settingsService';
import { PageGenerator } from '../pageGenerator';

describe('PageGenerator', () => {
  let classUnderTest: PageGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();
  const mockFileSystem = new Mock<typeof FileSystemAdapter>();
  const mockSettingsService = new Mock<ISettingsService>();

  beforeEach(() => {
    spyOn(console, 'log');
    mockFileSystemExtra.Setup(fse => fse.pathExists(Any<string>()), true);
    mockFileSystemExtra.Setup(fse => fse.outputFile(Any<string>(), Any<string>()));
    mockFileSystem.Setup(fs => fs.readFileSync(Any<string>(), 'utf8'), Buffer.from(Any<string>(), 'utf8'));
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.StyleExtension), 'css');

    classUnderTest = new PageGenerator(mockFileSystemExtra.Object, mockFileSystem.Object, mockSettingsService.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should only generate files when pages module is not available', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Any<string>()), false);
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
