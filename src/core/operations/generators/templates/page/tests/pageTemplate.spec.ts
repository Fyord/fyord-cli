import { PageTemplate } from '../pageTemplate';

describe('PageTemplate', () => {
  beforeAll(() => {
    spyOn(console, 'log');
  });

  it('should generate template without args', () => {
    expect(PageTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(PageTemplate(['name'])).toBeDefined();
  });
});
