import { Strings } from 'tsbase/System/Strings';
import { Any, Mock } from 'tsmockit';
import { IFileSystemExtraAdapter } from '../../../../fileSystem/fileSystemExtraAdapter';
import { StaticFunctionGenerator } from '../staticFunctionGenerator';

describe('StaticFunctionGenerator', () => {
  const mockFseAdapter = new Mock<IFileSystemExtraAdapter>();
  let classUnderTest: StaticFunctionGenerator;

  beforeEach(() => {
    classUnderTest = new StaticFunctionGenerator(mockFseAdapter.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return failing result when no args given', async () => {
    const result = await classUnderTest.Generate([]);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should return failing result when no extension arg given', async () => {
    const result = await classUnderTest.Generate(['name']);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should return successful result and output two files when name and extension args are given', async () => {
    mockFseAdapter.Setup(f => f.outputFile(Any<string>(), Any<string>()));

    const result = await classUnderTest.Generate(['name', 'json']);

    mockFseAdapter.Verify(f => f.outputFile(Strings.Empty, Strings.Empty), 2);
    expect(result.IsSuccess).toBeTruthy();
  });
});
