import { ComponentSpecTemplate } from '../componentSpecTemplate';

describe('ComponentSpecTemplate', () => {
  it('should generate template without args', () => {
    expect(ComponentSpecTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(ComponentSpecTemplate(['name'])).toBeDefined();
  });
});
