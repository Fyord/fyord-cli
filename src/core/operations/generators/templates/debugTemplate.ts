import { Template } from './template';

export const DebugTemplate: Template = () => {
  return `{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch in Edge",
      "type": "edge",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "\${workspaceFolder}"
    },
    {
      "name": "Launch in Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "\${workspaceFolder}"
    },
    {
      "name": "Jest Watch Current File",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/node_modules/jest/bin/jest",
      "args": [
        "\${fileBasename}",
        "-c",
        "./jest.config.js",
        "--verbose",
        "-i",
        "--no-cache",
        "--watchAll"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}`;
};
