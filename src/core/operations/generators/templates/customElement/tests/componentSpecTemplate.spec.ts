import { CustomElementSpecTemplate } from '../customElementSpecTemplate';

describe('CustomElementSpecTemplate', () => {
  it('should generate template without args', () => {
    expect(CustomElementSpecTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(CustomElementSpecTemplate(['name', 'selector'])).toBeDefined();
  });
});
