import { Strings } from 'tsbase';
import { Template } from '../template';

export const GitHubActionTemplate: Template = (args?: string[]) => {
  const trunk = args?.[0] || Strings.Empty;

  return `name: CI

on:
  push:
    branches: '${trunk}'
  pull_request:
    branches: '*'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Use Node.js 14.x
        uses: actions/setup-node@v1
        with:
          node-version: 14.x
      - run: npm i
      - run: npm run lint
      - run: npm run test-once
      - run: npm run build
      - run: npm run pre-render
      - uses: actions/upload-artifact@v2
        with:
          name: build
          path: ./public
      - name: Comment Code Coverage to PRs
        if: \${{ github.event_name == 'pull_request' }}
        uses: romeovs/lcov-reporter-action@v0.2.16
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          lcov-file: ./coverage/lcov.info
`;
};
