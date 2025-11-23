import { useEffect, useMemo, useRef } from 'react';
import { AnyFn, throttle, ThrottledFn, ThrottleOptions } from '@ur-apps/common';

import { useLatest } from '../use-latest';

/**
 * A custom React hook that creates a throttled version of the provided callback function.
 *
 * @param callback The function to throttle (recommended to be memoized with useCallback, but not required)
 * @param delay The delay in milliseconds to wait before calling the function
 * @param options Additional throttle options (leading, trailing, signal)
 * @returns A memoized throttled function with cancel, flush, and pending methods
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 *
 * const throttledSearch = useThrottle((term: string) => {
 *   // Perform search API call
 *   searchAPI(term);
 * }, 300);
 *
 * useEffect(() => {
 *   if (searchTerm) {
 *     throttledSearch(searchTerm);
 *   }
 * }, [searchTerm, throttledSearch]);
 * ```
 */
export function useThrottle<F extends AnyFn>(fn: F, wait: number, options?: ThrottleOptions) {
  const latestCallback = useLatest(fn);
  const throttledRef = useRef<ThrottledFn<F> | null>(null);

  const throttledFn = useMemo(() => {
    if (throttledRef.current) {
      throttledRef.current.cancel();
    }

    const wrappedCallback = (...args: Parameters<F>) => {
      return latestCallback.current(...args);
    };

    const throttled = throttle(wrappedCallback as F, wait, options);

    throttledRef.current = throttled;

    return throttled;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wait, options?.leading, options?.trailing, options?.signal]);

  useEffect(() => {
    // Cleanup function to cancel any pending throttled calls on unmount
    return () => {
      throttledRef.current?.cancel();
    };
  }, []);

  return throttledFn;
}
