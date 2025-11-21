/* eslint-disable complexity */

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

  let timeoutId: NodeJS.Timeout | undefined;
  let lastThis: unknown;
  let lastArgs: Parameters<F> | null = null;
  let lastResult: ReturnType<F>;
  let lastCallTime: number | null = null;
  let lastInvokeTime: number | null = null;
  let seriesStartTime: number | null = null;

  const invoke = (): ReturnType<F> => {
    lastInvokeTime = Date.now();
    lastResult = fn.apply(lastThis, lastArgs!);
    seriesStartTime = lastInvokeTime;

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
    // seriesStartTime = null;
  };

  const debounced: DebouncedFn<F> = function (this: unknown, ...args) {
    const now = Date.now();

    // if (isNullish(lastInvokeTime) || now - lastInvokeTime > Math.max(wait, maxWait || 0)) {
    //   lastInvokeTime = now;
    // }

    const timeSinceLastCall = isNullish(lastCallTime) ? null : now - lastCallTime;
    let timeSinceLastInvoke = isNullish(lastInvokeTime) ? null : now - lastInvokeTime;

    if (isNullish(lastInvokeTime) || (timeSinceLastInvoke && timeSinceLastInvoke > Math.max(wait, maxWait || 0))) {
      lastInvokeTime = now;
      timeSinceLastInvoke = now - lastInvokeTime;
    }

    if (
      isNullish(seriesStartTime) ||
      Math.max(timeSinceLastCall ?? 0, timeSinceLastInvoke ?? 0) > Math.max(wait, maxWait || 0)
    ) {
      if (options.logging) {
        console.log('@'.repeat(20), seriesStartTime, '|', timeSinceLastInvoke);
      }
      seriesStartTime = now;
    }

    // 👇 ДОБАВЛЕНО: Если нет активного таймера и прошло много времени - это новая серия
    // if (!timeoutId && timeSinceLastInvoke > Math.max(wait, maxWait || 0)) {
    //   seriesStartTime = now;
    //   lastInvokeTime = now;
    // }

    const timeSinceSeriesStart = now - seriesStartTime;

    const shouldInvokeLeading = leading && (isNullish(timeSinceLastCall) || timeSinceLastCall >= wait); // нужно подумать, над тем как тут должно быть > || >=

    // const shouldInvokeMaxWait =
    //   maxWait &&
    //   ((isNullish(lastInvokeTime) && timeSinceSeriesStart > maxWait) ||
    //     (timeSinceLastInvoke && timeSinceLastInvoke > maxWait));
    // const shouldInvokeMaxWait = maxWait && Math.min(timeSinceLastInvoke!, timeSinceSeriesStart) > maxWait;
    // const shouldInvokeMaxWait = maxWait && (timeSinceSeriesStart >= maxWait || timeSinceLastInvoke! >= maxWait);
    const shouldInvokeMaxWait = maxWait && timeSinceSeriesStart >= maxWait;
    // const shouldInvokeMaxWait = maxWait && timeSinceLastInvoke && timeSinceLastInvoke >= maxWait;

    // const waitTime = maxWait ? Math.min(wait, maxWait - timeSinceSeriesStart) : wait;
    const waitTime = maxWait ? Math.min(wait, maxWait - timeSinceLastInvoke!) : wait;
    // const waitTime = maxWait ? Math.min(timeSinceLastCall!, maxWait - timeSinceLastInvoke!) : wait;
    // const waitTime = maxWait ? Math.min(wait, maxWait - timeSinceLastInvoke!, maxWait - timeSinceSeriesStart) : wait;

    updateCallState(this, args, now);

    if (options.logging) {
      console.log(
        '\ntimeSinceLastCall',
        timeSinceLastCall,
        '\ntimeSinceLastInvoke',
        timeSinceLastInvoke,
        '\ntimeSinceSeriesStart',
        timeSinceSeriesStart,
        '\nwait',
        wait,
        '\nmaxWait',
        maxWait,
        '\nwaitTime',
        waitTime
      );
    }

    if (shouldInvokeLeading || shouldInvokeMaxWait) {
      if (options.logging) {
        console.log(
          '^'.repeat(10),
          `Invoke Leading (${shouldInvokeLeading}) or MaxWait (${shouldInvokeMaxWait})`,
          lastArgs
        );
      }

      resetTimeout();

      return invoke();
    }

    if (!trailing) {
      return lastResult;
    }

    resetTimeout();

    timeoutId = setTimeout(() => {
      if (options.logging) {
        console.log('$'.repeat(10), 'Trailing invoke', lastArgs);
      }

      invoke();
      resetTimeout();
    }, waitTime);

    return lastResult;
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

export function debounce2<F extends AnyFn>(
  fn: F,
  wait: number,
  options: DebounceOptions & { logging?: boolean } = {}
): DebouncedFn<F> {
  const { leading = false, trailing = true, signal } = options;
  const maxWait = isNullish(options.maxWait) ? undefined : Math.max(options.maxWait, wait);
  // const maxWait = options.maxWait;

  // if (!leading && !trailing) {
  //   throw new Error('Debounce options "leading" and "trailing" cannot both be false.');
  // }

  let timeoutId: NodeJS.Timeout | undefined;
  let lastThis: unknown;
  let lastArgs: Parameters<F> | null = null;
  let lastResult: ReturnType<F>;
  let lastCallTime: number | null = null;
  let lastInvokeTime: number | null = null;
  let seriesStartTime: number | null = null;

  const invoke = (): ReturnType<F> => {
    lastResult = fn.apply(lastThis, lastArgs!);

    // Clean up state after invocation
    resetCallState();
    lastInvokeTime = Date.now();

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
    seriesStartTime = null;
  };

  const debounced: DebouncedFn<F> = function (this: unknown, ...args) {
    const now = Date.now();

    // if (
    //   (isNullish(timeoutId) && !leading) ||
    //   isNullish(lastInvokeTime) ||
    //   (leading && maxWait && now - lastInvokeTime > maxWait)
    //   // isNullish(lastInvokeTime) ||
    //   // (maxWait && isNullish(timeoutId))
    // ) {
    //   lastInvokeTime = now;
    // }

    if (isNullish(seriesStartTime)) {
      seriesStartTime = now;
    }

    const timeSinceLastCall = isNullish(lastCallTime) ? null : now - lastCallTime;
    const timeSinceLastInvoke = isNullish(lastInvokeTime) ? null : now - lastInvokeTime;
    const timeInSeries = now - seriesStartTime;

    // Initialize invoke time on first call and new series
    if (!timeSinceLastInvoke || timeSinceLastInvoke > Math.max(wait, maxWait || 0)) {
      // if (!timeSinceLastInvoke || isNullish(timeoutId)) {
      // if (isNullish(timeoutId)) {
      lastInvokeTime = now;
      // timeSinceLastInvoke = now - lastInvokeTime;
    }

    // if (isNullish(lastInvokeTime) || timeSinceLastInvoke! > Math.max(wait, maxWait || 0)) {
    //   lastInvokeTime = now;
    // }

    const shouldInvokeLeading = leading && (isNullish(timeSinceLastCall) || timeSinceLastCall >= wait);
    const shouldInvokeMaxWait = maxWait && timeSinceLastInvoke! >= maxWait;
    const waitTime = maxWait ? Math.min(wait, maxWait - timeInSeries) : wait;

    updateCallState(this, args, now);

    if (options.logging) {
      console.log(
        '\ntimeSinceLastCall',
        timeSinceLastCall,
        '\ntimeSinceLastInvoke',
        timeSinceLastInvoke,
        '\ntimeInSeries',
        timeInSeries,
        '\nwait',
        wait,
        '\nmaxWait',
        maxWait,
        '\nwaitTime',
        waitTime
      );
    }

    if (shouldInvokeLeading || shouldInvokeMaxWait) {
      if (options.logging) {
        console.log(
          '^'.repeat(10),
          `Leading invoke ${shouldInvokeLeading} || Max Wait invoke ${shouldInvokeMaxWait}`,
          lastArgs
        );
      }

      resetTimeout();

      return invoke();
    }

    if (!trailing) {
      return lastResult;
    }

    resetTimeout();

    timeoutId = setTimeout(() => {
      if (options.logging) {
        console.log('$'.repeat(10), 'Trailing invoke', lastArgs);
      }

      invoke();
      resetTimeout();
    }, waitTime);

    return lastResult;
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

export function debounce3<F extends AnyFn>(fn: F, wait: number, options: DebounceOptions = {}): DebouncedFn<F> {
  const { leading = false, trailing = true, maxWait, signal } = options;

  let timeoutId: NodeJS.Timeout | undefined;
  let lastThis: unknown;
  let lastArgs: Parameters<F> | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime: number | null = null;
  let maxWaitTimer: number | null = null; // 👈 ДОБАВЛЕНО

  const invoke = (): ReturnType<F> => {
    const result: ReturnType<F> = fn.apply(lastThis, lastArgs!);

    lastThis = null;
    lastArgs = null;
    lastInvokeTime = Date.now();
    maxWaitTimer = null; // 👈 СБРОС при выполнении

    return result;
  };

  const resetTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  const debounced: DebouncedFn<F> = function (this: unknown, ...args) {
    const now = Date.now();
    const isInvoking = timeoutId !== undefined; // 👈 Есть ли активная серия?
    const timeSinceLastCall = lastCallTime ? now - lastCallTime : null;

    // Запускаем отсчёт maxWait при первом вызове в серии
    if (!isInvoking && maxWait) {
      maxWaitTimer = now; // 👈 ФИКСИРУЕМ начало серии
    }

    lastThis = this;
    lastArgs = args;
    lastCallTime = now;

    // Проверка leading
    const shouldInvokeLeading = leading && !isInvoking;

    // Проверка maxWait - считаем от НАЧАЛА СЕРИИ
    const timeSinceSeriesStart = maxWaitTimer ? now - maxWaitTimer : 0;
    const shouldInvokeMaxWait = maxWait && maxWaitTimer && timeSinceSeriesStart >= maxWait;

    if (shouldInvokeLeading || shouldInvokeMaxWait) {
      resetTimeout();
      return invoke();
    }

    if (!trailing) {
      return;
    }

    // Рассчитываем время ожидания с учётом maxWait
    let waitTime = wait;
    if (maxWait && maxWaitTimer) {
      const remainingMaxWait = maxWait - timeSinceSeriesStart;
      waitTime = Math.min(wait, remainingMaxWait);
    }

    resetTimeout();

    timeoutId = setTimeout(() => {
      invoke();
      resetTimeout();
    }, waitTime);
  };

  debounced.cancel = () => {
    resetTimeout();
    maxWaitTimer = null; // 👈 СБРОС
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
