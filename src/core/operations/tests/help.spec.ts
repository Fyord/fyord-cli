import { HelpOperation } from '../help';

describe('HelpOperation', () => {
  let classUnderTest: HelpOperation;

  beforeEach(() => {
    classUnderTest = new HelpOperation();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
