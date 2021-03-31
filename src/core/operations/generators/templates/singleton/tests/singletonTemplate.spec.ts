import { SingletonTemplate } from '../singletonTemplate';

describe('SingletonTemplate', () => {
  it('should generate template without args', () => {
    expect(SingletonTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(SingletonTemplate(['name'])).toBeDefined();
  });
});
