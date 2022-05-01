import { StaticFunctionTemplate } from '../staticFunctionTemplate';

describe('staticFunctionTemplate', () => {
  it('should return value when there are no args', () => {
    expect(StaticFunctionTemplate()).toBeDefined();
  });

  it('should return value for non json extension', () => {
    expect(StaticFunctionTemplate(['test', 'txt'])).toBeDefined();
  });

  it('should return value for json extension', () => {
    expect(StaticFunctionTemplate(['test', 'json'])).toBeDefined();
  });
});
