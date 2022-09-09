import { Any, Mock } from 'tsmockit';
import { Strings } from 'tsbase';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/fileSystemExtraAdapter';
import { CustomElementGenerator } from '../customElementGenerator';
import { ISettingsService } from '../../../../settings/settingsService';
import { Settings } from '../../../../settings/settings';
import { FileSystemAdapter } from '../../../../fileSystem/fileSystemAdapter';

describe('CustomElementGenerator', () => {
  let classUnderTest: CustomElementGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();
  const mockFileSystem = new Mock<typeof FileSystemAdapter>();
  const mockSettingsService = new Mock<ISettingsService>();

  beforeEach(() => {
    spyOn(console, 'log');
    mockFileSystemExtra.Setup(fse => fse.outputFile(Any<string>(), Any<string>()));
    mockFileSystemExtra.Setup(fse => fse.pathExists(Any<string>()), true);
    mockFileSystem.Setup(fs => fs.readFileSync(Any<string>(), 'utf8'), Buffer.from(Any<string>(), 'utf8'));
    mockSettingsService.Setup(s => s.GetSettingOrDefault(Settings.StyleExtension), 'css');

    classUnderTest = new CustomElementGenerator(mockFileSystemExtra.Object, mockFileSystem.Object, mockSettingsService.Object);
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
