import { VersionOperation } from '../version';

describe('VersionOperation', () => {
  let classUnderTest: VersionOperation;

  beforeEach(() => {
    classUnderTest = new VersionOperation();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
