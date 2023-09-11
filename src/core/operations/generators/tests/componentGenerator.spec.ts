import { Strings } from 'tsbase';
import { Any, Mock } from 'tsmockit';
import { FileSystemAdapter, IFileSystemExtraAdapter } from '../../../../fileSystem/module';
import { Settings } from '../../../../settings/settings';
import { ISettingsService } from '../../../../settings/settingsService';
import { ComponentGenerator } from '../componentGenerator';

describe('ComponentGenerator', () => {
  let classUnderTest: ComponentGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();
  const mockFileSystem = new Mock<typeof FileSystemAdapter>();
  const mockSettingsService = new Mock<ISettingsService>();

  beforeEach(() => {
    jest.spyOn(console, 'log');
    mockFileSystemExtra.Setup(fse => fse.outputFile(Any<string>(), Any<string>()));
    mockFileSystem.Setup(fs => fs.readFileSync(Any<string>(), 'utf8'), Buffer.from(Any<string>(), 'utf8'));
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.StyleExtension), 'css');

    classUnderTest = new ComponentGenerator(mockFileSystemExtra.Object, mockFileSystem.Object, mockSettingsService.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should just generate files when module not present', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Any<string>()), false);

    await classUnderTest.Generate(['name']);
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 3);
  });

  it('should generate files and update module when module present', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Any<string>()), true);

    await classUnderTest.Generate(['name']);
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 4);
  });
});
