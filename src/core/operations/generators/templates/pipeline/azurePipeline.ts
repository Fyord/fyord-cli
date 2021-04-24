import { Strings } from 'tsbase';
import { Template } from '../template';

export const AzurePipelineTemplate: Template = (args?: string[]) => {
  const trunk = args?.[0] || Strings.Empty;

  return `trigger:
- ${trunk}

pool:
  vmImage: ubuntu-latest
  demands: npm

  timeoutInMinutes: 10

steps:
- task: Npm@1
  displayName: 'npm install'
  inputs:
    verbose: false

- task: Npm@1
  displayName: 'lint'
  inputs:
    command: custom
    verbose: false
    customCommand: 'run lint'

- task: Npm@1
  displayName: 'test'
  inputs:
    command: custom
    verbose: false
    customCommand: 'run test-once'

- task: Npm@1
  displayName: 'build'
  inputs:
    command: custom
    verbose: false
    customCommand: 'run build'

- task: Npm@1
  displayName: 'pre-render'
  inputs:
    command: custom
    verbose: false
    customCommand: 'run pre-render'
    customEndpoint:

- task: PublishBuildArtifacts@1
  displayName: 'Publish artifacts: public'
  inputs:
    PathtoPublish: public
    ArtifactName: public
`;
};
