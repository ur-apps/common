import { throttle } from './throttle';

describe('[utils] throttle', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic functionality', () => {
    it('should throttle function calls (default leading=true, trailing=true)', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled('a'); // immediate (leading)
      throttled('b'); // scheduled for trailing
      throttled('c'); // last args should win for trailing

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith('a');

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('c');
    });

    it('should pass arguments and preserve context (this)', () => {
      type Ctx = { value: string };
      const obj = {
        value: 'ctx',
        method: jest.fn(function (this: Ctx, a: number, b: number) {
          return { thisValue: this.value, sum: a + b };
        }),
      };
      const throttled = throttle(obj.method, 100);

      const res = throttled.call(obj, 1, 2); // leading call returns value
      expect(res).toEqual({ thisValue: 'ctx', sum: 3 });
      expect(obj.method).toHaveBeenCalledTimes(1);
      expect(obj.method).toHaveBeenLastCalledWith(1, 2);

      throttled.call(obj, 5, 7); // trailing should use these args
      jest.advanceTimersByTime(100);

      expect(obj.method).toHaveBeenCalledTimes(2);
      expect(obj.method).toHaveBeenLastCalledWith(5, 7);
    });

    it('should return result for leading call', () => {
      const mockFn = jest.fn(() => 'immediate');
      const throttled = throttle(mockFn, 100);

      const result = throttled();
      expect(result).toBe('immediate');
    });
  });

  describe('Leading option', () => {
    it('should not execute immediately when leading=false', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100, { leading: false });

      throttled();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should execute only once per window when leading=true and trailing=false', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100, { leading: true, trailing: false });

      throttled(); // immediate
      throttled(); // ignored within window
      throttled(); // ignored within window

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttled(); // next window immediate
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should execute both leading and trailing when both are true', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100, { leading: true, trailing: true });

      throttled(); // immediate
      throttled(); // schedule trailing
      throttled(); // update trailing args

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Trailing option', () => {
    it('should execute trailing by default if additional calls happen', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled('first'); // leading
      throttled('second'); // trailing scheduled with last args

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(1, 'first');
      expect(mockFn).toHaveBeenNthCalledWith(2, 'second');
    });

    it('should not execute trailing if there was only a single leading call', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled('only'); // leading
      jest.advanceTimersByTime(150);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith('only');
    });

    it('should not execute on trailing edge when trailing=false', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100, { trailing: false });

      throttled(); // leading
      throttled(); // ignored

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should not execute when both leading and trailing are false (single call)', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100, { leading: false, trailing: false });

      throttled();
      jest.advanceTimersByTime(150);

      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('Cancel method', () => {
    it('should cancel pending trailing execution', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled(); // leading
      throttled(); // schedule trailing
      expect(throttled.pending()).toBe(true);

      throttled.cancel();
      expect(throttled.pending()).toBe(false);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1); // no trailing call
    });

    it('should handle multiple cancel calls gracefully', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled();
      throttled();
      throttled.cancel();
      throttled.cancel(); // should not throw

      expect(throttled.pending()).toBe(false);
    });
  });

  describe('Flush method', () => {
    it('should execute pending trailing immediately', () => {
      const mockFn = jest.fn().mockReturnValue('flushed');
      const throttled = throttle(mockFn, 100);

      throttled('a'); // leading
      throttled('b'); // trailing pending

      const result = throttled.flush();
      expect(result).toBe('flushed');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('b');
      expect(throttled.pending()).toBe(false);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2); // no extra call
    });

    it('should return undefined when no pending execution', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled(); // leading only, no pending trailing
      const result = throttled.flush();
      expect(result).toBeUndefined();
    });
  });

  describe('Pending method', () => {
    it('should reflect pending state correctly', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      expect(throttled.pending()).toBe(false);

      throttled(); // leading, no pending yet
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(throttled.pending()).toBe(false);

      throttled(); // schedule trailing
      expect(throttled.pending()).toBe(true);

      jest.advanceTimersByTime(100);
      expect(throttled.pending()).toBe(false);
    });
  });

  describe('AbortSignal integration', () => {
    it('should cancel trailing when signal is aborted', () => {
      const controller = new AbortController();
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100, { signal: controller.signal });

      throttled(); // leading
      throttled(); // schedule trailing
      expect(throttled.pending()).toBe(true);

      controller.abort();
      expect(throttled.pending()).toBe(false);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should work without signal', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled();
      jest.advanceTimersByTime(100);

      // No trailing expected because there was only single call
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero wait time', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 0);

      throttled(); // immediate
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle function that throws on trailing call', () => {
      const errorFn = jest.fn(() => {
        throw new Error('Test error');
      });
      const throttled = throttle(errorFn, 100, { leading: false });

      throttled();
      expect(() => {
        jest.advanceTimersByTime(100);
      }).toThrow('Test error');
    });

    it('should handle functions that return falsy values on leading', () => {
      const falsyFn = jest.fn(() => 0);
      const throttled = throttle(falsyFn, 100);

      const result = throttled();
      expect(result).toBe(0);
    });

    it('should maintain separate state for multiple throttled functions', () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const t1 = throttle(fn1, 100);
      const t2 = throttle(fn2, 200);

      t1('a1');
      t2('a2');

      expect(fn1).toHaveBeenCalledWith('a1');
      expect(fn2).toHaveBeenCalledWith('a2');

      jest.advanceTimersByTime(100);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(200);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
    });

    it('should limit calls when triggered more often than wait', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      const tick = (ms: number) => jest.advanceTimersByTime(ms);

      throttled('t0'); // immediate
      for (let i = 1; i <= 9; i++) {
        tick(10); // every 10ms within the same 100ms window
        throttled(`t${i}`);
      }

      // Still only the leading call so far
      expect(mockFn).toHaveBeenCalledTimes(1);

      // End of window -> one trailing call with the last args
      tick(10); // complete 100ms
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('t9');
    });
  });

  describe('Complex scenarios', () => {
    it('should use last arguments for trailing call with rapid successive calls', () => {
      const mockFn = jest.fn();
      const throttled = throttle(mockFn, 100);

      throttled('call-0');
      for (let i = 1; i < 10; i++) {
        jest.advanceTimersByTime(10);
        throttled(`call-${i}`);
      }

      // Leading only so far
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Complete the throttle window
      jest.advanceTimersByTime(10);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('call-9');
    });
  });

  describe('Lodash compatibility tests', () => {
    it('should throttle a function with multiple calls', () => {
      let callCount = 0;
      const throttled = throttle(function () {
        callCount++;
      }, 32);

      throttled();
      throttled();
      throttled();

      const lastCount = callCount;
      expect(callCount).toBeGreaterThan(0);

      jest.advanceTimersByTime(64);
      expect(callCount).toBeGreaterThan(lastCount);
    });

    it('should return result of first call for subsequent calls', () => {
      const identity = (value: string) => value;
      const throttled = throttle(identity, 32);

      const results = [throttled('a'), throttled('b')];
      expect(results).toEqual(['a', 'a']);

      jest.advanceTimersByTime(64);

      const results2 = [throttled('c'), throttled('d')];
      expect(results2[0]).not.toBe('a');
      expect(results2[0]).not.toBeUndefined();

      expect(results2[1]).not.toBe('d');
      expect(results2[1]).not.toBeUndefined();
    });

    it('should not trigger trailing call when invoked once', () => {
      let callCount = 0;
      const throttled = throttle(function () {
        callCount++;
      }, 32);

      throttled();
      expect(callCount).toBe(1);

      jest.advanceTimersByTime(64);
      expect(callCount).toBe(1);
    });

    it('should trigger call when invoked repeatedly', () => {
      let callCount = 0;
      const throttled = throttle(function () {
        callCount++;
      }, 32);

      for (let i = 0; i < 100; i++) {
        throttled();
        jest.advanceTimersByTime(3);
      }

      const actual = callCount > 1;
      expect(actual).toBe(true);
    });

    it('should trigger call when invoked repeatedly with leading false', () => {
      let callCount = 0;
      const throttled = throttle(
        function () {
          callCount++;
        },
        32,
        { leading: false }
      );

      for (let i = 0; i < 100; i++) {
        throttled();
        jest.advanceTimersByTime(3);
      }

      const actual = callCount > 1;
      expect(actual).toBe(true);
    });

    it('should trigger second throttled call as soon as possible', () => {
      let callCount = 0;
      const throttled = throttle(
        function () {
          callCount++;
        },
        128,
        { leading: false }
      );

      throttled();

      jest.advanceTimersByTime(128);
      expect(callCount).toBe(1);

      throttled();
      jest.advanceTimersByTime(62);
      expect(callCount).toBe(1);

      jest.advanceTimersByTime(130);
      expect(callCount).toBe(2);
    });

    it('should apply default options correctly', () => {
      let callCount = 0;
      const throttled = throttle(
        function () {
          callCount++;
        },
        32,
        {}
      );

      throttled();
      throttled();
      expect(callCount).toBe(1);

      jest.advanceTimersByTime(128);
      expect(callCount).toBe(2);
    });

    it('should support leading option with immediate return', () => {
      const identity = (value: string) => value;

      const withLeading = throttle(identity, 32, { leading: true });
      expect(withLeading('a')).toBe('a');

      const withoutLeading = throttle(identity, 32, { leading: false });
      expect(withoutLeading('a')).toBeUndefined();
    });

    it('should support trailing option behavior', () => {
      let withCount = 0;
      let withoutCount = 0;

      const withTrailing = throttle(
        function (value: string) {
          withCount++;
          return value;
        },
        64,
        { trailing: true }
      );

      const withoutTrailing = throttle(
        function (value: string) {
          withoutCount++;
          return value;
        },
        64,
        { trailing: false }
      );

      expect(withTrailing('a')).toBe('a');
      expect(withTrailing('b')).toBe('a');

      expect(withoutTrailing('a')).toBe('a');
      expect(withoutTrailing('b')).toBe('a');

      jest.advanceTimersByTime(256);
      expect(withCount).toBe(2);
      expect(withoutCount).toBe(1);
    });

    it('should not update last called at end of timeout when trailing is false', () => {
      let callCount = 0;
      const throttled = throttle(
        function () {
          callCount++;
        },
        64,
        { trailing: false }
      );

      throttled();
      throttled();

      jest.advanceTimersByTime(96);
      throttled();
      throttled();

      jest.advanceTimersByTime(96);
      expect(callCount).toBeGreaterThan(1);
    });

    it('should handle system time edge cases', () => {
      let callCount = 0;
      const throttled = throttle(function (value: string) {
        callCount++;
        return value;
      }, 32);

      const results = [throttled('a'), throttled('b'), throttled('c')];
      expect(results).toEqual(['a', 'a', 'a']);
      expect(callCount).toBe(1);

      jest.advanceTimersByTime(64);
      expect(callCount).toBe(2);
    });
  });
});
