import { GitHubActionTemplate } from '../githubAction';

describe('GitHubActionTemplate', () => {
  it('should generate template without args', () => {
    expect(GitHubActionTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(GitHubActionTemplate(['name'])).toBeDefined();
  });
});
