# @urapps/react

React hooks and utilities shared by UR Apps projects. Works in client-side and server-rendered React applications (SPA, Next.js).

## Installation

```bash
npm install @urapps/react @urapps/common react
```

Peer dependencies: `react` 19 and `@urapps/common`. The package is ESM-only.

## Usage

```tsx
import { useRef } from 'react';
import { classNames, useDebounce, useHover } from '@urapps/react';

function SearchField({ onSearch }: { onSearch: (query: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const hovered = useHover(ref, { enterDelay: 200 });
  const search = useDebounce(onSearch, 300);

  return (
    <input
      ref={ref}
      className={classNames('field', { 'field--hovered': hovered })}
      onChange={(event) => search(event.target.value)}
    />
  );
}
```

## API

### Hooks

| Export                      | Description                                                                                            | Docs                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `useDebounce`               | Debounced version of a callback that always calls its latest version; cancels pending calls on unmount | [README](https://github.com/ur-apps/common/blob/master/packages/react/src/hooks/use-debounce/README.md) |
| `useThrottle`               | Throttled version of a callback, same guarantees as `useDebounce`                                      | [README](https://github.com/ur-apps/common/blob/master/packages/react/src/hooks/use-throttle/README.md) |
| `useHover`                  | Hover state of the element behind a ref, with enter/leave delays and pointer type filtering            | [README](https://github.com/ur-apps/common/blob/master/packages/react/src/hooks/use-hover/README.md)    |
| `useFocus`                  | Focus state of the element behind a ref, optionally only for `:focus-visible`                          | [README](https://github.com/ur-apps/common/blob/master/packages/react/src/hooks/use-focus/README.md)    |
| `useFlag`                   | Boolean state with a stable `toggle`                                                                   | [README](https://github.com/ur-apps/common/blob/master/packages/react/src/hooks/use-flag/README.md)     |
| `useLatest`                 | Ref that always holds the latest value                                                                 |                                                                                                         |
| `useIsomorphicLayoutEffect` | `useLayoutEffect` in the browser, `useEffect` on the server                                            |                                                                                                         |

### Utilities

| Export       | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| `classNames` | Joins class names from strings, arrays and `{ className: condition }` maps |

### Types

`UseHoverOptions`, `UseFocusOptions`, `PointerType`, `TClasses`.

## Related packages

- [`@urapps/common`](https://www.npmjs.com/package/@urapps/common) — platform-agnostic utilities this package builds on.
- [`@urapps/eslint-config`](https://www.npmjs.com/package/@urapps/eslint-config) (`/react`), [`@urapps/prettier-config`](https://www.npmjs.com/package/@urapps/prettier-config) (`/react`), [`@urapps/tsconfig`](https://www.npmjs.com/package/@urapps/tsconfig) (`/react`) — shared tooling configs for React projects.

## License

[ISC](./LICENSE)
