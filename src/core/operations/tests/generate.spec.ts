import { GenerateOperation } from '../generate';

describe('GenerateOperation', () => {
  let classUnderTest: GenerateOperation;

  beforeEach(() => {
    classUnderTest = new GenerateOperation();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
