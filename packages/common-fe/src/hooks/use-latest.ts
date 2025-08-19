import { useRef } from 'react';

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

/**
 * A custom React hook that returns a mutable ref object containing the latest value.
 *
 * This is useful for accessing the most recent value inside callbacks or effects
 * without triggering re-renders. The ref is updated synchronously after each render
 * when the value changes.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
