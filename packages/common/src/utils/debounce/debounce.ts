import { AnyFn } from 'types';

import { isNullish } from '../get-type';

import { DebouncedFn, DebounceOptions } from './types';

/**
 * Creates a debounced version of the provided function.
 *
 * @param fn The function to debounce.
 * @param wait The number of milliseconds to wait before invoking the function.
 * @param options Options for controlling the debounce behavior.
 * @returns A debounced version of the original function.
 */
export function debounce<F extends AnyFn>(fn: F, wait: number, options: DebounceOptions = {}): DebouncedFn<F> {
  const { leading = false, trailing = true, maxWait, signal } = options;

  let timeoutId: NodeJS.Timeout | undefined;
  let lastThis: unknown;
  let lastArgs: Parameters<F> | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime: number | null = null;

  const invoke = (): ReturnType<F> => {
    const result: ReturnType<F> = fn.apply(lastThis, lastArgs!);

    // Clean up state after invocation
    lastThis = null;
    lastArgs = null;
    lastInvokeTime = Date.now();

    return result;
  };

  const resetTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);

      timeoutId = undefined;
    }
  };

  const updateCallState = (context: unknown, args: Parameters<F>, now: number): void => {
    lastThis = context;
    lastArgs = args;
    lastCallTime = now;
  };

  const debounced: DebouncedFn<F> = function (this: unknown, ...args) {
    const now = Date.now();
    const isFirstCall = isNullish(lastCallTime);
    const hasInvoked = !isNullish(lastInvokeTime);

    // Initialize invoke time on first call
    if (isFirstCall) {
      lastInvokeTime = now;
    }

    const timeSinceLastInvoke = now - lastInvokeTime!;
    const shouldInvokeLeading = leading && (!hasInvoked || (!trailing && timeSinceLastInvoke! >= wait));
    const shouldInvokeMaxWait = Boolean(maxWait && !isFirstCall && timeSinceLastInvoke! >= maxWait);
    const shouldSkipExecution = !trailing && !isNullish(timeSinceLastInvoke) && timeSinceLastInvoke < wait;

    updateCallState(this, args, now);

    // Execute immediately on leading edge or if maxWait time has been exceeded
    if (shouldInvokeLeading || shouldInvokeMaxWait) {
      resetTimeout();

      return invoke();
    }

    // Skip execution if conditions are met
    if (shouldSkipExecution) {
      return;
    }

    resetTimeout();

    // Schedule execution
    const waitTime = maxWait ? Math.min(wait, maxWait - timeSinceLastInvoke) : wait;

    timeoutId = setTimeout(() => {
      invoke();
      resetTimeout();
    }, waitTime);
  };

  debounced.cancel = () => {
    resetTimeout();
  };

  debounced.flush = () => {
    if (!timeoutId) return;

    resetTimeout();

    return invoke();
  };

  debounced.pending = () => Boolean(timeoutId);

  signal?.addEventListener('abort', debounced.cancel);

  return debounced;
}
