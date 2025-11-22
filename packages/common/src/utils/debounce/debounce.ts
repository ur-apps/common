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
export function debounce<F extends AnyFn>(
  fn: F,
  wait: number,
  options: DebounceOptions & { logging?: boolean } = {}
): DebouncedFn<F> {
  const { leading = false, trailing = true, signal } = options;
  const maxWait = options.maxWait && options.maxWait < wait ? wait : options.maxWait;

  let lastThis: unknown;
  let lastArgs: Parameters<F> | null = null;
  let lastResult: ReturnType<F>;

  let timeoutId: NodeJS.Timeout | undefined;
  let lastCallTime: number | null = null;
  let lastInvokeTime: number | null = null;

  const invoke = (): ReturnType<F> => {
    lastInvokeTime = Date.now();
    lastResult = fn.apply(lastThis, lastArgs!);

    resetCallState();

    return lastResult;
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

  const resetCallState = (): void => {
    lastThis = null;
    lastArgs = null;
  };

  const debounced: DebouncedFn<F> = function (this: unknown, ...args) {
    const now = Date.now();

    if (isNullish(lastInvokeTime) || (!leading && now - lastInvokeTime > Math.max(wait, maxWait || 0))) {
      lastInvokeTime = now;
    }

    const timeSinceLastCall = isNullish(lastCallTime) ? null : now - lastCallTime;
    const timeSinceLastInvoke = isNullish(lastInvokeTime) ? 0 : now - lastInvokeTime;

    // нужно подумать, над тем как тут должно быть > || >=
    const shouldInvokeLeading = leading && (isNullish(timeSinceLastCall) || timeSinceLastCall >= wait);
    const shouldInvokeMaxWait = maxWait && timeSinceLastInvoke >= maxWait;
    const waitTime = maxWait ? Math.min(wait, maxWait - timeSinceLastInvoke) : wait;

    updateCallState(this, args, now);

    if (shouldInvokeLeading || shouldInvokeMaxWait) {
      resetTimeout();

      return invoke();
    }

    if (!trailing) {
      return lastResult;
    }

    resetTimeout();

    timeoutId = setTimeout(() => {
      invoke();
      resetTimeout();
    }, waitTime);

    return lastResult;
  };

  debounced.cancel = () => {
    resetTimeout();
    resetCallState();

    lastCallTime = null;
    lastInvokeTime = null;
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
