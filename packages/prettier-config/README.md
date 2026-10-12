# @urapps/prettier-config

Shared Prettier configs for UR Apps projects: 120-character lines, single quotes, trailing commas (ES5) and grouped, sorted imports via `@ianvs/prettier-plugin-sort-imports`.

| Import                          | For                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| `@urapps/prettier-config`       | Any TypeScript project                                                                        |
| `@urapps/prettier-config/react` | React projects: `react` imports first, Next.js and Feature-Sliced Design folders, styles last |
| `@urapps/prettier-config/nest`  | NestJS projects: NestJS folders and `@app/*` libraries of a Nest monorepo                     |

Imports are grouped as: Node.js built-ins and packages, then local folders imported by name (`components/…`, `@/…`, `dtos/…`, depending on the variant), then parent (`../`) and sibling (`./`) imports.

## Installation

```bash
npm install --save-dev @urapps/prettier-config prettier @ianvs/prettier-plugin-sort-imports
```

## Usage

In `package.json`:

```json
{
  "prettier": "@urapps/prettier-config/react"
}
```

To change options, extend the config in `prettier.config.mjs` instead:

```js
import config from '@urapps/prettier-config/react';

export default {
  ...config,
  printWidth: 100,
};
```

## License

[ISC](./LICENSE)
