import { VersionOperation } from '../version';

describe('VersionOperation', () => {
  let classUnderTest: VersionOperation;

  beforeEach(() => {
    classUnderTest = new VersionOperation();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should execute', async () => {
    jest.spyOn(console, 'log');
    const result = await classUnderTest.Execute();
    expect(result.IsSuccess).toBeTruthy();
  });
});
