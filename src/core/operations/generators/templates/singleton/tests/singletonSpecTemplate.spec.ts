import { SingletonSpecTemplate } from '../singletonSpecTemplate';

describe('SingletonSpecTemplate', () => {
  it('should generate template without args', () => {
    expect(SingletonSpecTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(SingletonSpecTemplate(['name'])).toBeDefined();
  });
});
