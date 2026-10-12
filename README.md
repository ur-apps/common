# UR Apps common

Shared libraries and tooling configs for UR Apps projects, published to npm under the `@urapps` scope. The repository is an npm workspaces monorepo managed by Lerna; every package is versioned and released independently.

## Packages

| Package                                                 | Description                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| [`@urapps/common`](./packages/common)                   | Platform-agnostic utilities and types                            |
| [`@urapps/react`](./packages/react)                     | React hooks and utilities                                        |
| [`@urapps/nest`](./packages/nest)                       | NestJS building blocks: responses, validation, exceptions, roles |
| [`@urapps/eslint-config`](./packages/eslint-config)     | Shared ESLint configs: base, React, NestJS                       |
| [`@urapps/prettier-config`](./packages/prettier-config) | Shared Prettier configs: base, React, NestJS                     |
| [`@urapps/tsconfig`](./packages/tsconfig)               | Shared TypeScript configs: base, React, NestJS                   |

Each package has its own README with installation and usage.

## Development

Requirements: Node.js 24 and npm.

```bash
npm ci
```

`npm ci` also installs a `pre-push` Git hook that runs the same checks as CI.

### Scripts

All scripts run across every package that defines them.

| Script                                  | What it does                                  |
| --------------------------------------- | --------------------------------------------- |
| `npm run build`                         | Builds the packages into their `lib` folders  |
| `npm run typecheck`                     | Type-checks sources and tests                 |
| `npm run lint` / `npm run lint:fix`     | Runs ESLint / fixes what it can               |
| `npm run format` / `npm run format:fix` | Checks formatting with Prettier / rewrites it |
| `npm test`                              | Runs the tests with Vitest                    |

`@urapps/react` and `@urapps/nest` type-check and test against the built `lib` of `@urapps/common`, so run `npm run build` first.

## Releasing

Versions are bumped locally with Lerna on `master`:

```bash
npm run release:prerelease   # 1.0.0-rc.0 → 1.0.0-rc.1
npm run release:patch
npm run release:minor
npm run release:major
```

Lerna bumps the packages changed since their last release, commits `chore: release`, tags each package (`@urapps/<name>@<version>`) and pushes. The push to `master` triggers the [publish workflow](./.github/workflows/npm-publish.yml): it runs the CI checks and publishes every package whose version is not on npm yet.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This project is licensed under the ISC License. See the [LICENSE](./LICENSE) file for more details.

## Authors

- Garry Freeman - [garryfreeman09@gmail.com](mailto:garryfreeman09@gmail.com)

## Acknowledgments

- Thanks to all contributors and maintainers of the dependencies used in this project.
- Special thanks to the UR Apps team for their support and contributions.
