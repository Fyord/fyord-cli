import { WebComponentTemplate } from '../../module';

describe('WebComponentTemplate', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log');
  });

  it('should generate template without args', () => {
    expect(WebComponentTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(WebComponentTemplate(['name', 'selector'])).toBeDefined();
  });
});
