# @urapps/eslint-config

Shared ESLint configs (flat config, ESLint 10) for UR Apps projects.

| Import                        | For                                                                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@urapps/eslint-config`       | Any TypeScript project: `@eslint/js` and `typescript-eslint` recommended rules plus UR Apps rules                                                    |
| `@urapps/eslint-config/react` | React projects: adds `@eslint-react`, `eslint-plugin-react-hooks` (React Compiler rules included), `eslint-plugin-react-refresh` and browser globals |
| `@urapps/eslint-config/nest`  | NestJS projects: adds Node.js globals                                                                                                                |

## Installation

```bash
npm install --save-dev @urapps/eslint-config eslint @eslint/js typescript-eslint globals
```

For `/react` also install the React plugins:

```bash
npm install --save-dev @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

## Usage

`eslint.config.mjs`:

```js
import config from '@urapps/eslint-config/react';
import { defineConfig } from 'eslint/config';

export default defineConfig(config, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

Set `tsconfigRootDir` in your own config: without it typescript-eslint cannot choose the tsconfig root when the editor has several projects open.

## License

[ISC](./LICENSE)
