import { AnyFn } from 'types';

import { debounce } from '../debounce';

import { ThrottledFn, ThrottleOptions } from './types';

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * The throttled function comes with a cancel method to cancel delayed func invocations
 * and a flush method to immediately invoke them.
 *
 * This implementation uses debounce with maxWait to achieve throttling behavior.
 */
export function throttle<F extends AnyFn>(fn: F, wait: number, options: ThrottleOptions = {}): ThrottledFn<F> {
  const { leading = true, trailing = true, signal } = options;

  const debouncedFn: ThrottledFn<F> = debounce(fn, wait, {
    leading,
    trailing,
    maxWait: wait, // This makes it throttle - ensures function is called at least once per wait period
    signal,
  });

  return debouncedFn;
}
