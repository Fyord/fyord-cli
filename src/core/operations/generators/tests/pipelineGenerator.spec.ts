import { Strings } from 'tsbase';
import { Mock } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/module';
import { PipelineGenerator, PipelineTypes } from '../pipelineGenerator';

const trunk = 'master';

describe('PipelineGenerator', () => {
  let classUnderTest: PipelineGenerator;
  const mockFileSystemExtra = new Mock<IFileSystemExtraAdapter>();

  beforeEach(() => {
    mockFileSystemExtra.Setup(fse => fse.outputFile(Strings.Empty, Strings.Empty));
    classUnderTest = new PipelineGenerator(mockFileSystemExtra.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });


  it('should generate github pipeline when given trunk branch', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), true);

    const result = await classUnderTest.Generate([PipelineTypes.GitHub, trunk]);

    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 1);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should generate azure pipeline when given trunk branch', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), true);


    const result = await classUnderTest.Generate([PipelineTypes.Azure, trunk]);

    mockFileSystemExtra.Verify(fse => fse.outputFile(Strings.Empty, Strings.Empty), 1);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should return a failed result when no pipeline type argument is given', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), true);
    const result = await classUnderTest.Generate([]);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should return a failed result when no trunk argument is given', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), true);
    const result = await classUnderTest.Generate([PipelineTypes.Azure]);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should return a failed result when an invalid pipeline type argument is given', async () => {
    mockFileSystemExtra.Setup(fse => fse.pathExists(Strings.Empty), true);
    const result = await classUnderTest.Generate(['fake', trunk]);
    expect(result.IsSuccess).toBeFalsy();
  });
});
