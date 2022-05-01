import { StaticFunctionSpecTemplate } from '../staticFunctionSpecTemplate';

describe('staticFunctionTemplate', () => {
  it('should return value when there are no args', () => {
    expect(StaticFunctionSpecTemplate()).toBeDefined();
  });

  it('should return value for non json extension', () => {
    expect(StaticFunctionSpecTemplate(['test', 'txt'])).toBeDefined();
  });

  it('should return value for json extension', () => {
    expect(StaticFunctionSpecTemplate(['test', 'json'])).toBeDefined();
  });
});
