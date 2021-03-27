import { PageGenerator } from '../pageGenerator';

describe('PageGenerator', () => {
  let classUnderTest: PageGenerator;

  beforeEach(() => {
    classUnderTest = new PageGenerator();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
