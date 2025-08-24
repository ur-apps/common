import { AnyFn } from 'types';

export type ThrottleOptions = {
  /**
   * Call on the leading edge (first call immediately)
   * @default true
   */
  leading?: boolean;
  /**
   * Call on the trailing edge
   * @default true
   */
  trailing?: boolean;
  /**
   * AbortSignal to cancel the throttled function
   */
  signal?: AbortSignal;
};

export type ThrottledFn<F extends AnyFn> = ((...args: Parameters<F>) => ReturnType<F> | undefined) & {
  /**
   * Cancel the throttled function call.
   */
  cancel: () => void;
  /**
   * Flush the throttled function call, executing it immediately if there are pending calls.
   * @returns the result of the function call or undefined if no call was made.
   */
  flush: () => ReturnType<F> | undefined;
  /**
   * Check if there is a pending throttled call.
   * @returns true if there is a pending call, false otherwise.
   */
  pending: () => boolean;
};
