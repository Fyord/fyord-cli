import { WebComponentStylesTemplate } from '../../module';

describe('WebComponentStylesTemplate', () => {
  beforeAll(() => {
    spyOn(console, 'log');
  });

  it('should generate template without args', () => {
    expect(WebComponentStylesTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(WebComponentStylesTemplate(['name', 'selector'])).toBeDefined();
  });
});
