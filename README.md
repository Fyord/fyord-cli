# fyord-cli
A companion CLI to the Fyord framework.

## Installation
- `npm i`

## Test
- `npm test`

## Lint
- `npm run lint`

## Build (with source maps)
- `npm run build`

## Publish to npm (manually)
- Update `./dist/package.json` version*.
- `npm login`
- `npm run build-prod`
- `npm run publish`

## Publish to npm (CI)
- Update `./dist/package.json` version*.
- Merge changes to trunk (main) branch.
  - Assuming the build passes and the version in the `./dist/package.json` has been updated, CI will publish the new version.

*Use Semantic Versioning (MAJOR.MINOR.PATCH - 1.1.1)
- MAJOR version when you make incompatible API changes
- MINOR version when you add functionality in a backwards compatible manner
- PATCH version when you make backwards compatible bug fixes.

Consider changes relative to `src/index.ts` to be changes to the api.
