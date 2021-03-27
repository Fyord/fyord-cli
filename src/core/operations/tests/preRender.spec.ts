import { PreRenderOperation } from '../preRender';

describe('PreRenderOperation', () => {
  let classUnderTest: PreRenderOperation;

  beforeEach(() => {
    classUnderTest = new PreRenderOperation();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
