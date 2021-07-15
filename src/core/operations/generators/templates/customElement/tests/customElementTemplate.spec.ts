import { CustomElementTemplate } from '../customElementTemplate';

describe('CustomElementTemplate', () => {
  beforeAll(() => {
    spyOn(console, 'log');
  });

  it('should generate template without args', () => {
    expect(CustomElementTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(CustomElementTemplate(['name', 'selector'])).toBeDefined();
  });
});
