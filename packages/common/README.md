# @urapps/common

Platform-agnostic utilities and types shared by UR Apps projects. Works in the browser and in Node.js and has no runtime dependencies.

## Installation

```bash
npm install @urapps/common
```

The package is ESM-only.

## Usage

```ts
import { debounce, get, getErrorMessage, isNullish } from '@urapps/common';

const save = debounce((value: string) => api.save(value), 300);

const city = get(user, 'address.city', 'Unknown');

try {
  await api.load();
} catch (error) {
  console.error(getErrorMessage(error));
}
```

## API

### Functions

| Export                                                                                                                             | Description                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `debounce`                                                                                                                         | Delays calls until the function has not been called for `wait` ms; supports `leading`, `trailing`, `maxWait`, `signal`, and `cancel()` / `flush()` / `pending()` |
| `throttle`                                                                                                                         | Calls the function at most once per `wait` ms; same options and methods as `debounce`, without `maxWait`                                                         |
| `clone`, `cloneArray`, `cloneObject`, `cloneMap`, `cloneSet`, `cloneDate`                                                          | Deep copies; circular references between objects and arrays are preserved                                                                                        |
| `get`                                                                                                                              | Reads a nested value by a dotted path or an array of keys, with a default                                                                                        |
| `pick`                                                                                                                             | Copies the listed own keys of an object                                                                                                                          |
| `getErrorMessage`                                                                                                                  | Turns any thrown value into a readable message, including the causes of an `AggregateError`                                                                      |
| `getType`, `isAllowedType`                                                                                                         | Returns a value's type tag (`'array'`, `'date'`, `'null'`, …) / checks it against a list                                                                         |
| `isString`, `isNumber`, `isBigInt`, `isBoolean`, `isSymbol`, `isDate`, `isArray`, `isObject`, `isNull`, `isUndefined`, `isNullish` | Type guards                                                                                                                                                      |

### Types

`AnyFn`, `DebounceOptions`, `DebouncedFn`, `ThrottleOptions`, `ThrottledFn`, `TValueType`.

## Related packages

- [`@urapps/react`](https://www.npmjs.com/package/@urapps/react) — React hooks and utilities built on this package.
- [`@urapps/nest`](https://www.npmjs.com/package/@urapps/nest) — NestJS building blocks.
- [`@urapps/eslint-config`](https://www.npmjs.com/package/@urapps/eslint-config), [`@urapps/prettier-config`](https://www.npmjs.com/package/@urapps/prettier-config), [`@urapps/tsconfig`](https://www.npmjs.com/package/@urapps/tsconfig) — shared tooling configs.

## License

[ISC](./LICENSE)
