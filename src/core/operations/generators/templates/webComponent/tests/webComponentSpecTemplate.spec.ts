import { WebComponentSpecTemplate } from '../../module';

describe('WebComponentSpecTemplate', () => {
  beforeAll(() => {
    spyOn(console, 'log');
  });

  it('should generate template without args', () => {
    expect(WebComponentSpecTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(WebComponentSpecTemplate(['name', 'selector'])).toBeDefined();
  });
});
