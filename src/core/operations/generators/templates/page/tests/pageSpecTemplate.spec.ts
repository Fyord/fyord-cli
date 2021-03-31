import { PageSpecTemplate } from '../pageSpecTemplate';

describe('PageSpecTemplate', () => {
  it('should generate template without args', () => {
    expect(PageSpecTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(PageSpecTemplate(['name'])).toBeDefined();
  });
});
