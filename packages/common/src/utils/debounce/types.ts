import { AnyFn } from 'types';

export type DebounceOptions = {
  /**
   * Call on the leading edge (first call immediately)
   * @default false
   */
  leading?: boolean;
  /**
   * Call on the trailing edge
   * @default true
   */
  trailing?: boolean;
  /**
   * Ensure call is not less than maxWait ms (gives throttle behavior)
   */
  maxWait?: number;
  /**
   * AbortSignal to cancel the throttled function
   */
  signal?: AbortSignal;
};

export type DebouncedFn<F extends AnyFn> = ((...args: Parameters<F>) => ReturnType<F> | undefined) & {
  /**
   * Cancel the debounced function call.
   */
  cancel: () => void;
  /**
   * Flush the debounced function call, executing it immediately if there are pending calls.
   * @returns the result of the function call or undefined if no call was made.
   */
  flush: () => ReturnType<F> | undefined;
  /**
   * Check if there is a pending debounced call.
   * @returns true if there is a pending call, false otherwise.
   */
  pending: () => boolean;
};
