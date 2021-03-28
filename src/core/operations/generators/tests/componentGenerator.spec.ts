import { Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/module';
import { ComponentGenerator } from '../componentGenerator';

describe('ComponentGenerator', () => {
  let classUnderTest: ComponentGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();

  beforeEach(() => {
    mockFileSystemExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    classUnderTest = new ComponentGenerator(mockFileSystemExtra.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should generate', async () => {
    await classUnderTest.Generate(['name']);
    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 3);
  });
});
