import { Mock, Times } from 'tsmockit';
import { GenerateOperation } from '../generate';
import { GeneratorMap, Generators, IGenerator } from '../generators/generators';

describe('GenerateOperation', () => {
  let classUnderTest: GenerateOperation;
  const mockGeneratorKey = 'mockGen';
  const mockGenerator = new Mock<IGenerator>();

  beforeAll(() => {
    spyOn(console, 'error');
    mockGenerator.Setup(g => g.Generate([]));
    GeneratorMap.set(mockGeneratorKey as Generators, mockGenerator.Object);
  });

  beforeEach(() => {
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
});
