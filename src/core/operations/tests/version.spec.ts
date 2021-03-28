import { VersionOperation } from '../version';

describe('VersionOperation', () => {
  let classUnderTest: VersionOperation;

  beforeEach(() => {
    classUnderTest = new VersionOperation();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should execute', () => {
    spyOn(console, 'log');
    const result = classUnderTest.Execute();
    expect(result.IsSuccess).toBeTruthy();
  });
});
