# @urapps/tsconfig

Shared TypeScript configs (TypeScript 6) for UR Apps projects. They set the language level and type checking rules and emit nothing.

| Extend                   | For                    | Key options                                                                  |
| ------------------------ | ---------------------- | ---------------------------------------------------------------------------- |
| `@urapps/tsconfig`       | Any TypeScript project | `ES2022`, `moduleResolution: bundler`, `strict`, `isolatedModules`, `noEmit` |
| `@urapps/tsconfig/react` | React projects         | base + `DOM`, `DOM.Iterable`, `jsx: react-jsx`                               |
| `@urapps/tsconfig/nest`  | NestJS projects        | base + `ES2024`, `NodeNext`, decorators with metadata                        |

## Installation

```bash
npm install --save-dev @urapps/tsconfig
```

## Usage

`tsconfig.json`:

```json
{
  "extends": "@urapps/tsconfig/react",
  "compilerOptions": {
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

Add on your side what the configs leave out on purpose:

- `types` — global type packages your project relies on (TypeScript 6 includes none by default);
- `declaration`, `outDir` and `noEmit: false` — if the project emits files;
- `rootDir`, `paths` — paths are resolved relative to the file that declares them, so they cannot live in a shared config.

## License

[ISC](./LICENSE)
