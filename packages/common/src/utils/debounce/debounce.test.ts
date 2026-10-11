import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce } from './debounce.ts';

describe('[utils] debounce', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Basic functionality', () => {
    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(90);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2', 123);

      vi.advanceTimersByTime(90);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    it('should preserve function context (this)', () => {
      const obj1 = {
        value: 'unchanged',
        method: vi.fn(function (this: { value: string }) {
          this.value = 'changed';
        }),
      };
      const obj2 = {
        value: 'unchanged',
      };

      const debouncedMethod = debounce(obj1.method, 100);

      debouncedMethod.call(obj1);
      debouncedMethod.call(obj2);
      vi.advanceTimersByTime(100);

      expect(obj1.method).toHaveBeenCalledTimes(1);
      expect(obj1.value).toBe('unchanged');
      expect(obj2.value).toBe('changed');
    });

    it('should return undefined when not leading', () => {
      const mockFn = vi.fn(() => 'result');
      const debouncedFn = debounce(mockFn, 100);

      const result = debouncedFn();

      expect(result).toBeUndefined();
    });
  });

  describe('Trailing option', () => {
    it('should execute on trailing edge by default', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(90);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should not execute on trailing edge when trailing is false', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { trailing: false });

      debouncedFn();
      vi.advanceTimersByTime(1000);

      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should skip trailing call when leading is enabled and trailing is disabled', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: false });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(99);
      debouncedFn();
      vi.advanceTimersByTime(1000);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Leading option', () => {
    it('should execute immediately when leading is true', () => {
      const mockFn = vi.fn(() => 'immediate result');
      const debouncedFn = debounce(mockFn, 100, { leading: true });

      const result = debouncedFn();

      expect(result).toBe('immediate result');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should prevent repeated calls during wait period when trailing is disabled', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: false });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      debouncedFn();
      vi.advanceTimersByTime(50);
      debouncedFn();
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should execute both leading and trailing when both are enabled', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: true });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(25);
      debouncedFn();
      vi.advanceTimersByTime(25);
      debouncedFn();
      vi.advanceTimersByTime(75);
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(25);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should allow new leading call after trailing execution completes', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: true });

      debouncedFn(0);
      expect(mockFn).toHaveBeenCalledTimes(1);

      debouncedFn();
      vi.advanceTimersByTime(25);
      debouncedFn();
      vi.advanceTimersByTime(25);
      debouncedFn();
      vi.advanceTimersByTime(25);
      debouncedFn();
      vi.advanceTimersByTime(25);
      debouncedFn();
      vi.advanceTimersByTime(25);
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(75);
      expect(mockFn).toHaveBeenCalledTimes(2);

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(3);

      debouncedFn();
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(3);

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(4);

      vi.advanceTimersByTime(200);
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(5);
    });
  });

  describe('MaxWait option', () => {
    it('should execute after maxWait period even with continuous calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { maxWait: 200 });

      debouncedFn();
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      debouncedFn();
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      debouncedFn();
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      debouncedFn();
      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should respect maxWait with leading option enabled', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(75);
      debouncedFn();

      vi.advanceTimersByTime(75);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should not trigger trailing when only single call is made with leading', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should execute trailing call when multiple invocations occur within wait period', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should trigger maxWait with frequent calls and preserve latest arguments', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn('call-1');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith('call-1');

      vi.advanceTimersByTime(50);
      debouncedFn('call-2');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      debouncedFn('call-3');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(40);
      debouncedFn('call-4');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(10);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('call-4');

      debouncedFn('call-5');
      expect(mockFn).toHaveBeenCalledTimes(2);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith('call-5');
    });

    it('should restart maxWait timer after execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn('call-1');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      debouncedFn('call-2');

      vi.advanceTimersByTime(50);
      debouncedFn('call-3');

      vi.advanceTimersByTime(40);
      debouncedFn('call-4');

      vi.advanceTimersByTime(10);
      expect(mockFn).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(10);
      debouncedFn('call-5');
      expect(mockFn).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith('call-5');
    });

    it('should allow new leading call after complete pause', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn('series-1');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('series-1');

      vi.advanceTimersByTime(200);

      debouncedFn('series-2');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('series-2');
    });

    it('should enforce maxWait boundary with rapid repeated calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(40);
        debouncedFn(`call-${i}`);
      }

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should cancel trailing call but preserve leading execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      debouncedFn.cancel();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should execute pending trailing call immediately when flushed', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn('test');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      debouncedFn('test2');

      debouncedFn.flush();
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('test2');
    });

    it('should invoke on maxWait boundary with continuous calls when trailing is false', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 1000, {
        leading: true,
        trailing: false,
        maxWait: 1500,
      });

      debouncedFn('t0');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith('t0');

      vi.advanceTimersByTime(176);
      debouncedFn('t176');
      vi.advanceTimersByTime(170);
      debouncedFn('t346');
      vi.advanceTimersByTime(171);
      debouncedFn('t517');
      vi.advanceTimersByTime(167);
      debouncedFn('t684');
      vi.advanceTimersByTime(176);
      debouncedFn('t860');
      vi.advanceTimersByTime(161);
      debouncedFn('t1021');
      vi.advanceTimersByTime(181);
      debouncedFn('t1202');
      vi.advanceTimersByTime(186);
      debouncedFn('t1388');
      vi.advanceTimersByTime(111);
      debouncedFn('t1499');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(2);
      expect(mockFn).toHaveBeenCalledTimes(1);

      debouncedFn('t1501');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('t1501');

      vi.advanceTimersByTime(72);
      debouncedFn('t1573');
      vi.advanceTimersByTime(182);
      debouncedFn('t1755');
      vi.advanceTimersByTime(194);
      debouncedFn('t1949');
      vi.advanceTimersByTime(183);
      debouncedFn('t2132');
      vi.advanceTimersByTime(185);
      debouncedFn('t2317');
      vi.advanceTimersByTime(175);
      debouncedFn('t2492');
      vi.advanceTimersByTime(191);
      debouncedFn('t2683');
      vi.advanceTimersByTime(188);
      debouncedFn('t2871');
      vi.advanceTimersByTime(182);
      expect(mockFn).toHaveBeenCalledTimes(2);
      debouncedFn('t3053');
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith('t3053');
    });
  });

  describe('Cancel method', () => {
    it('should cancel pending execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(debouncedFn.pending()).toBe(true);

      debouncedFn.cancel();
      expect(debouncedFn.pending()).toBe(false);

      vi.advanceTimersByTime(100);
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should handle multiple cancel calls gracefully', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn.cancel();
      debouncedFn.cancel();

      expect(debouncedFn.pending()).toBe(false);
    });
  });

  describe('Flush method', () => {
    it('should execute pending function immediately', () => {
      const mockFn = vi.fn();
      mockFn.mockReturnValue('flushed result');
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');
      const result = debouncedFn.flush();

      expect(result).toBe('flushed result');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(debouncedFn.pending()).toBe(false);
    });

    it('should return undefined when no pending execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      const result = debouncedFn.flush();
      expect(result).toBeUndefined();
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should not execute after flush when timer expires', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn.flush();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pending method', () => {
    it('should return true when execution is pending', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      expect(debouncedFn.pending()).toBe(false);

      debouncedFn();
      expect(debouncedFn.pending()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(debouncedFn.pending()).toBe(false);
    });

    it('should return false after cancel', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(debouncedFn.pending()).toBe(true);

      debouncedFn.cancel();
      expect(debouncedFn.pending()).toBe(false);
    });
  });

  describe('AbortSignal integration', () => {
    it('should cancel debounce when signal is aborted', () => {
      const controller = new AbortController();
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, { signal: controller.signal });

      debouncedFn();
      expect(debouncedFn.pending()).toBe(true);

      controller.abort();
      expect(debouncedFn.pending()).toBe(false);

      vi.advanceTimersByTime(100);
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should work without signal', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle rapid successive calls correctly', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      for (let i = 0; i < 10; i++) {
        debouncedFn(`call-${i}`);
        vi.advanceTimersByTime(10);
      }

      expect(mockFn).not.toHaveBeenCalled();
      expect(debouncedFn.pending()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call-9');
    });

    it('should handle mixed leading, trailing, and maxWait options', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 200, {
        leading: true,
        trailing: true,
        maxWait: 300,
      });

      debouncedFn('first');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      vi.advanceTimersByTime(50);
      debouncedFn('second');

      vi.advanceTimersByTime(50);
      debouncedFn('third');

      vi.advanceTimersByTime(50);
      debouncedFn('fourth');

      vi.advanceTimersByTime(200);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('fourth');
    });

    it('should maintain separate state for multiple debounced functions', () => {
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();
      const debouncedFn1 = debounce(mockFn1, 100);
      const debouncedFn2 = debounce(mockFn2, 200);

      debouncedFn1('fn1');
      debouncedFn2('fn2');

      vi.advanceTimersByTime(100);
      expect(mockFn1).toHaveBeenCalledWith('fn1');
      expect(mockFn1).toHaveBeenCalledTimes(1);
      expect(mockFn2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn2).toHaveBeenCalledWith('fn2');
      expect(mockFn2).toHaveBeenCalledTimes(1);
    });

    it('should execute trailing call after multiple invocations within wait period', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 500, {
        leading: false,
        trailing: true,
        maxWait: 1000,
      });

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      debouncedFn();
      vi.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(2000);
      expect(mockFn).toHaveBeenCalledTimes(1);

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should handle function that throws error', () => {
      const errorFn = vi.fn(() => {
        throw new Error('Test error');
      });
      const debouncedFn = debounce(errorFn, 100);

      debouncedFn();

      expect(() => {
        vi.advanceTimersByTime(100);
      }).toThrow('Test error');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero wait time', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn();
      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle very large wait times', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100000);

      debouncedFn();
      expect(debouncedFn.pending()).toBe(true);

      vi.advanceTimersByTime(50000);
      expect(mockFn).not.toHaveBeenCalled();
      expect(debouncedFn.pending()).toBe(true);

      vi.advanceTimersByTime(50000);
      expect(mockFn).toHaveBeenCalled();
      expect(debouncedFn.pending()).toBe(false);
    });

    it('should handle functions with no return value', () => {
      const voidFn = vi.fn();
      const debouncedFn = debounce(voidFn, 100);

      debouncedFn();
      vi.advanceTimersByTime(100);

      expect(voidFn).toHaveBeenCalledTimes(1);
    });

    it('should handle functions that return falsy values', () => {
      const falsyFn = vi.fn(() => 0);
      const debouncedFn = debounce(falsyFn, 100, { leading: true });

      const result = debouncedFn();

      expect(result).toBe(0);
    });
  });

  describe('Lodash compatibility tests', () => {
    it('should debounce a function and return results correctly', () => {
      let callCount = 0;
      const debounced = debounce(function (value: string) {
        callCount++;
        return value;
      }, 32);

      const results = [debounced('a'), debounced('b'), debounced('c')];
      expect(results).toEqual([undefined, undefined, undefined]);
      expect(callCount).toBe(0);

      vi.advanceTimersByTime(32);
      expect(callCount).toBe(1);

      const results2 = [debounced('d'), debounced('e'), debounced('f')];
      expect(results2).toEqual(['c', 'c', 'c']);
      expect(callCount).toBe(1);

      vi.advanceTimersByTime(32);
      expect(callCount).toBe(2);
    });

    it('should return last func result for subsequent debounced calls', () => {
      const identity = (value: string) => value;
      const debounced = debounce(identity, 32);

      debounced('a');

      vi.advanceTimersByTime(32);
      expect(debounced('b')).not.toBe('b');

      vi.advanceTimersByTime(32);
      expect(debounced('c')).not.toBe('c');
    });

    it('should not immediately call func when wait is 0', () => {
      let callCount = 0;
      const debounced = debounce(function () {
        callCount++;
      }, 0);

      debounced();
      debounced();
      expect(callCount).toBe(0);

      vi.advanceTimersByTime(0);
      expect(callCount).toBe(1);
    });

    it('should apply default options correctly', () => {
      let callCount = 0;
      const debounced = debounce(
        function () {
          callCount++;
        },
        32,
        {}
      );

      debounced();
      expect(callCount).toBe(0);

      vi.advanceTimersByTime(32);
      expect(callCount).toBe(1);
    });

    it('should support leading option with single and multiple calls', () => {
      const callCounts = [0, 0];

      const withLeading = debounce(
        function () {
          callCounts[0]++;
        },
        32,
        { leading: true }
      );

      const withLeadingAndTrailing = debounce(
        function () {
          callCounts[1]++;
        },
        32,
        { leading: true }
      );

      withLeading();
      expect(callCounts[0]).toBe(1);

      withLeadingAndTrailing();
      withLeadingAndTrailing();
      expect(callCounts[1]).toBe(1);

      vi.advanceTimersByTime(32);
      expect(callCounts).toEqual([1, 2]);

      withLeading();
      expect(callCounts[0]).toBe(2);
    });

    it('should return last func result for subsequent leading calls', () => {
      const identity = (value: string) => value;
      const debounced = debounce(identity, 32, { leading: true, trailing: false });

      const results = [debounced('a'), debounced('b')];
      expect(results).toEqual(['a', 'a']);

      vi.advanceTimersByTime(32);

      const results2 = [debounced('c'), debounced('d')];
      expect(results2).toEqual(['c', 'c']);
    });

    it('should support trailing option correctly', () => {
      let withCount = 0;
      let withoutCount = 0;

      const withTrailing = debounce(
        function () {
          withCount++;
        },
        32,
        { trailing: true }
      );

      const withoutTrailing = debounce(
        function () {
          withoutCount++;
        },
        32,
        { trailing: false }
      );

      withTrailing();
      expect(withCount).toBe(0);

      withoutTrailing();
      expect(withoutCount).toBe(0);

      vi.advanceTimersByTime(32);
      expect(withCount).toBe(1);
      expect(withoutCount).toBe(0);
    });

    it('should support maxWait option with delayed calls', () => {
      let callCount = 0;
      const debounced = debounce(
        function (value?: string) {
          callCount++;
          return value;
        },
        32,
        { maxWait: 64 }
      );

      debounced();
      debounced();
      expect(callCount).toBe(0);

      vi.advanceTimersByTime(64);
      expect(callCount).toBe(1);

      debounced();
      debounced();
      expect(callCount).toBe(1);

      vi.advanceTimersByTime(64);
      expect(callCount).toBe(2);

      vi.advanceTimersByTime(1000);
      expect(callCount).toBe(2);
    });

    it('should support maxWait in rapid succession', () => {
      let withCount = 0;
      let withoutCount = 0;

      const withMaxWait = debounce(
        function () {
          withCount++;
        },
        64,
        { maxWait: 128 }
      );

      const withoutMaxWait = debounce(function () {
        withoutCount++;
      }, 96);

      for (let i = 0; i < 10; i++) {
        withMaxWait();
        withoutMaxWait();
        vi.advanceTimersByTime(30);
      }

      expect(withoutCount).toBe(0);
      expect(withCount).toBeGreaterThan(0);
    });

    it('should queue trailing call for subsequent calls after maxWait', () => {
      let callCount = 0;
      const debounced = debounce(
        function () {
          callCount++;
        },
        200,
        { maxWait: 200 }
      );

      debounced();

      vi.advanceTimersByTime(190);
      debounced();

      vi.advanceTimersByTime(10);
      expect(callCount).toBe(1);
      debounced();

      vi.advanceTimersByTime(10);
      debounced();

      vi.advanceTimersByTime(185);
      expect(callCount).toBe(1);

      vi.advanceTimersByTime(5);
      expect(callCount).toBe(2);

      vi.advanceTimersByTime(1000);
      expect(callCount).toBe(2);
    });

    it('should cancel maxWait timer when delayed is invoked', () => {
      let callCount = 0;
      const debounced = debounce(
        function () {
          callCount++;
        },
        32,
        { maxWait: 64 }
      );

      debounced();

      vi.advanceTimersByTime(64);
      debounced();
      expect(callCount).toBe(1);

      vi.advanceTimersByTime(32);
      expect(callCount).toBe(2);
    });

    it('should invoke trailing call with correct arguments and context', () => {
      let actual: [unknown, string] | undefined;
      let callCount = 0;
      const object = {};

      const debounced = debounce(
        function (this: unknown, value: string) {
          actual = [this, value];
          callCount++;
          return callCount < 2;
        },
        32,
        { leading: true, maxWait: 64 }
      );

      debounced.call(object, 'a');
      expect(callCount).toBe(1);

      while (true) {
        vi.advanceTimersByTime(10);

        if (!debounced.call(object, 'a')) {
          break;
        }
      }

      expect(callCount).toBe(2);
      expect(actual).toEqual([object, 'a']);
    });
  });
});
