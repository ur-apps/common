# useMergeRefs Hook

A React hook that combines several refs into one ref callback, for components that need their own ref to an element and also pass the element to the ref given by the consumer.

## Features

- 🔗 Sets object refs and calls callback refs with the same element
- 🧹 Respects cleanup functions returned by callback refs (React 19)
- 🧊 The returned callback keeps its identity while the given refs stay the same
- 🕳️ Skips `undefined` and `null` refs
- 📝 Full TypeScript support

## Usage

### Own Ref and Consumer Ref

```tsx
import { Ref, useEffect, useRef } from 'react';
import { useMergeRefs } from '@urapps/react';

function Dialog({ ref, ...props }: { ref?: Ref<HTMLDivElement> }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(dialogRef, ref);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return <div {...props} ref={mergedRef} tabIndex={-1} />;
}
```

## API

### Parameters

```typescript
useMergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T>
```

- `...refs: (Ref<T> | undefined)[]` - Refs to combine: object refs, callback refs, `null` or `undefined`.

### Returns

- `RefCallback<T>` - A ref callback to pass to the element.

## Implementation Details

When the element is attached, the callback:

- Assigns it to the `current` of every object ref
- Calls every callback ref with it

When the element is detached, the callback returns a cleanup that:

- Sets the `current` of every object ref to `null`
- Calls the cleanup function returned by a callback ref, or calls the callback ref with `null` if it returned none

The callback is recreated only when one of the refs changes or the number of refs changes, so React reattaches the element only then.

## Limitations

- An inline callback ref (`ref={(node) => ...}`) is a new function on every render, so the merged callback changes and the element is reattached on every render. Memoize such refs with `useCallback`.
