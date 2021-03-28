import { ComponentTemplate } from '../componentTemplate';

describe('ComponentTemplate', () => {
  it('should generate template without args', () => {
    expect(ComponentTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(ComponentTemplate(['name'])).toBeDefined();
  });
});
