import { AzurePipelineTemplate } from '../azurePipeline';

describe('AzurePipelineTemplate', () => {
  it('should generate template without args', () => {
    expect(AzurePipelineTemplate()).toBeDefined();
  });

  it('should generate template with args', () => {
    expect(AzurePipelineTemplate(['name'])).toBeDefined();
  });
});
