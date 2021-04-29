import { ComponentTemplate } from '../componentTemplate';

describe('ComponentTemplate', () => {
  beforeAll(() => {
    spyOn(console, 'log');
  });

  it('should generate template without args', () => {
    expect(ComponentTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(ComponentTemplate(['name'])).toBeDefined();
  });
});
