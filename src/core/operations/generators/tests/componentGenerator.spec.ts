import { ComponentGenerator } from '../componentGenerator';

describe('ComponentGenerator', () => {
  let classUnderTest: ComponentGenerator;

  beforeEach(() => {
    classUnderTest = new ComponentGenerator();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
