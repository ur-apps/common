import { useEffect, useMemo } from 'react';
import { AnyFn, debounce, DebounceOptions } from '@ur-apps/common';

import { useLatest } from '../use-latest';

/**
 * A custom React hook that creates a debounced version of the provided callback function.
 *
 * @param callback The function to debounce
 * @param delay The delay in milliseconds to wait before calling the function
 * @param options Additional debounce options (leading, trailing, maxWait, signal)
 * @returns A memoized debounced function with cancel, flush, and pending methods
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 *
 * const debouncedSearch = useDebounce((term: string) => {
 *   // Perform search API call
 *   searchAPI(term);
 * }, 300);
 *
 * useEffect(() => {
 *   if (searchTerm) {
 *     debouncedSearch(searchTerm);
 *   }
 * }, [searchTerm, debouncedSearch]);
 * ```
 */
export function useDebounce<F extends AnyFn>(fn: F, wait: number, options?: DebounceOptions) {
  const latestCallback = useLatest(fn);

  const debouncedFn = useMemo(() => {
    const wrappedCallback = (...args: Parameters<F>) => {
      return latestCallback.current(...args);
    };

    return debounce(wrappedCallback as F, wait, options);
  }, [wait, options, latestCallback]);

  useEffect(() => {
    // Cleanup function to cancel any pending debounced calls on unmount
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}
