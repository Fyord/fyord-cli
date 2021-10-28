import { IPersister, Result } from 'tsbase';
import { Mock, Times } from 'tsmockit';
import { SettingsService } from '../../../settings/settingsService';

(() => {
  SettingsService.Destroy();
  const mockPersister = new Mock<IPersister<any>>();
  mockPersister.Setup(p => p.Retrieve(), []);
  mockPersister.Setup(p => p['filePath'], '');
  SettingsService.Instance(mockPersister.Object);
})();

import { GenerateOperation } from '../generate';
import { GeneratorMap, Generators } from '../generators/generators';
import { IGenerator } from '../generators/iGenerator';

describe('GenerateOperation', () => {
  let classUnderTest: GenerateOperation;
  const mockGeneratorKey = 'mockGen';
  const mockGenerator = new Mock<IGenerator>();

  beforeAll(() => {
    spyOn(console, 'error');

    mockGenerator.Setup(g => g.Generate([]), new Result());
    GeneratorMap.set(mockGeneratorKey as Generators, mockGenerator.Object);
  });

  beforeEach(() => {
    spyOn(console, 'log');
    classUnderTest = new GenerateOperation();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return a successful result when a map exists', async () => {
    const result = await classUnderTest.Execute([mockGeneratorKey]);
    expect(result.IsSuccess).toBeTruthy();
    mockGenerator.Verify(g => g.Generate([]), Times.Once);
  });

  it('should return a failed result when no map exists', async () => {
    const result = await classUnderTest.Execute(['fake']);

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain('Unknown generator, "fake"');
    mockGenerator.Verify(g => g.Generate([]), Times.Once);
  });

  it('should return a failed result when no map exists', async () => {
    const result = await classUnderTest.Execute(['fake']);

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain('Unknown generator, "fake"');
    mockGenerator.Verify(g => g.Generate([]), Times.Once);
  });

  it('should return if errors are present in the generate result', async () => {
    const failedResult = new Result();
    failedResult.AddError('test');
    mockGenerator.Setup(g => g.Generate([]), failedResult);

    const result = await classUnderTest.Execute([mockGeneratorKey]);

    expect(result.IsSuccess).toBeFalsy();
  });
});
