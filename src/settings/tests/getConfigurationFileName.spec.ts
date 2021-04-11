import { Mock } from 'tsmockit';
import { IFileSystemAdapter, Strings } from 'tsbase';
import { GetConfigurationFileName } from '../getConfigurationFileName';
import { ConfigurationFileName } from '../../core/constants';

describe('GetConfigurationFileName', () => {

  it('should return the current directory if there is a config file present there', () => {
    const mockFs = new Mock<IFileSystemAdapter>();
    mockFs.Setup(fs => fs.existsSync(Strings.Empty), true);
    expect(GetConfigurationFileName(mockFs.Object)).toEqual(`./${ConfigurationFileName}`);
  });

  it('should return the tenth directory up if there is a config file present there', () => {
    const mockFs = new Mock<IFileSystemAdapter>();
    const fifthDirectoryUp = `../../../../../${ConfigurationFileName}`;
    mockFs.Setup(fs => fs.existsSync(`./${ConfigurationFileName}`), false);
    mockFs.Setup(fs => fs.existsSync(`../${ConfigurationFileName}`), false);
    mockFs.Setup(fs => fs.existsSync(`../../${ConfigurationFileName}`), false);
    mockFs.Setup(fs => fs.existsSync(`../../../${ConfigurationFileName}`), false);
    mockFs.Setup(fs => fs.existsSync(`../../../../${ConfigurationFileName}`), false);
    mockFs.Setup(fs => fs.existsSync(fifthDirectoryUp), true);

    expect(GetConfigurationFileName(mockFs.Object)).toEqual(fifthDirectoryUp);
  });

  it('should return the current directory if there are no config files ten levels up', () => {
    const mockFs = new Mock<IFileSystemAdapter>();
    mockFs.Setup(fs => fs.existsSync(Strings.Empty), false);
    expect(GetConfigurationFileName(mockFs.Object)).toEqual(`./${ConfigurationFileName}`);
  });
});
