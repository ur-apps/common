# Contributing

## Setup

1. Use Node.js 24.
2. Run `npm ci` in the repository root. It installs the dependencies of all packages and a `pre-push` Git hook.
3. Run `npm run build` once: `@urapps/react` and `@urapps/nest` type-check and test against the built `@urapps/common`.

## Making a change

1. Branch off `master`.
2. Change the code in `packages/<name>/src` and add tests next to it (`*.test.ts`, Vitest).
3. Run the checks — the `pre-push` hook and CI run the same set:

   ```bash
   npm run build && npm run typecheck && npm run lint && npm run format && npm test
   ```

   To skip the hook once, push with `SKIP_SIMPLE_GIT_HOOKS=1`.

4. Open a pull request to `master` and fill in the template. CI runs the checks on every pull request.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), in one line, with the package name as the scope:

```text
feat(react): add useMediaQuery
fix(common): return the default value from get on a primitive in the path
build(nest): …
```

Scopes: `common`, `react`, `nest`, `eslint-config`, `prettier-config`, `tsconfig`; no scope for changes that span the repository. Mark breaking changes with `!` (`feat(nest)!: …`).

## Code conventions

- Packages are ESM. Relative imports name the source file with its extension (`./clone.ts`, `./hooks/index.ts`); the build rewrites them to `.js`.
- `@urapps/nest` additionally uses path aliases (`dtos`, `exceptions`, …) declared in its `tsconfig.build.json`.
- Code is linted and formatted with this repository's own `@urapps/eslint-config` and `@urapps/prettier-config`.

## Adding a package

Create `packages/<name>` with a `package.json` named `@urapps/<name>` at the current version line, a `README.md` and a `LICENSE`. Give it the scripts it needs (`build`, `typecheck`, `lint`, `format`, `test`) — the root scripts and CI pick them up automatically — and connect the shared configs as the existing packages do.

## Releasing

Releases are cut by the maintainer, see [Releasing](./README.md#releasing) in the README.
