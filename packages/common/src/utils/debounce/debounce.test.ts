import { debounce } from './debounce';

describe('[utils] debounce', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic functionality', () => {
    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn() as jest.MockedFunction<(arg1: string, arg2: string, arg3: number) => void>;
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2', 123);
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    it('should preserve context (this)', () => {
      const obj = {
        value: 'test',
        method: jest.fn(),
      };
      const debouncedMethod = debounce(obj.method, 100);

      debouncedMethod.call(obj);
      jest.advanceTimersByTime(100);

      expect(obj.method).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when not leading', () => {
      const mockFn = jest.fn(() => 'result');
      const debouncedFn = debounce(mockFn, 100);

      const result = debouncedFn();
      expect(result).toBeUndefined();
    });
  });

  describe('Leading option', () => {
    it('should execute immediately when leading is true', () => {
      const mockFn = jest.fn(() => 'immediate result');
      const debouncedFn = debounce(mockFn, 100, { leading: true });

      const result = debouncedFn();
      expect(result).toBe('immediate result');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should not execute again during wait period with leading=true and trailing=false', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: false });

      debouncedFn(); // Should execute immediately
      debouncedFn(); // Should not execute
      debouncedFn(); // Should not execute

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should execute both leading and trailing when both are true', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: true });

      debouncedFn(); // Leading call
      debouncedFn(); // Resets timer
      debouncedFn(); // Resets timer

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should execute leading call again after wait period has passed', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: false });

      debouncedFn(); // First leading call
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      debouncedFn(); // Second leading call after wait period
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Trailing option', () => {
    it('should execute on trailing edge by default', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should not execute on trailing edge when trailing is false', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { trailing: false });

      debouncedFn();
      jest.advanceTimersByTime(100);

      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should not execute when both leading and trailing are false', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: false, trailing: false });

      debouncedFn();
      jest.advanceTimersByTime(100);

      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('MaxWait option', () => {
    it('should execute after maxWait period even with continuous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { maxWait: 200 });

      debouncedFn();
      jest.advanceTimersByTime(50);

      debouncedFn();
      jest.advanceTimersByTime(50);

      debouncedFn();
      jest.advanceTimersByTime(50);

      debouncedFn();
      jest.advanceTimersByTime(50);

      expect(mockFn).toHaveBeenCalledTimes(1); // Called at maxWait
    });

    it('should respect maxWait with leading option', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn(); // Leading call
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(75);
      debouncedFn(); // Reset timer but within maxWait

      jest.advanceTimersByTime(75); // Total 150ms, should trigger maxWait
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should use minimum of wait and remaining maxWait time', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 200, { maxWait: 100 });

      debouncedFn();
      jest.advanceTimersByTime(100); // Should trigger maxWait, not wait

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cancel method', () => {
    it('should cancel pending execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(debouncedFn.pending()).toBe(true);

      debouncedFn.cancel();
      expect(debouncedFn.pending()).toBe(false);

      jest.advanceTimersByTime(100);
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should handle multiple cancel calls gracefully', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn.cancel();
      debouncedFn.cancel(); // Should not throw

      expect(debouncedFn.pending()).toBe(false);
    });
  });

  describe('Flush method', () => {
    it('should execute pending function immediately', () => {
      const mockFn = jest.fn() as jest.MockedFunction<(arg1: string, arg2: string) => string>;
      mockFn.mockReturnValue('flushed result');
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');
      const result = debouncedFn.flush();

      expect(result).toBe('flushed result');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(debouncedFn.pending()).toBe(false);
    });

    it('should return undefined when no pending execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      const result = debouncedFn.flush();
      expect(result).toBeUndefined();
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should not execute after flush when timer expires', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn.flush();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });

  describe('Pending method', () => {
    it('should return true when execution is pending', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      expect(debouncedFn.pending()).toBe(false);

      debouncedFn();
      expect(debouncedFn.pending()).toBe(true);

      jest.advanceTimersByTime(100);
      expect(debouncedFn.pending()).toBe(false);
    });

    it('should return false after cancel', () => {
      const mockFn = jest.fn();
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
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { signal: controller.signal });

      debouncedFn();
      expect(debouncedFn.pending()).toBe(true);

      controller.abort();
      expect(debouncedFn.pending()).toBe(false);

      jest.advanceTimersByTime(100);
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should work without signal', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100); // No signal provided

      debouncedFn();
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle rapid successive calls correctly', () => {
      const mockFn = jest.fn() as jest.MockedFunction<(arg: string) => void>;
      const debouncedFn = debounce(mockFn, 100);

      // Rapid calls within debounce period
      for (let i = 0; i < 10; i++) {
        debouncedFn(`call-${i}`);
        jest.advanceTimersByTime(10); // 10ms between calls
      }

      // Only the last call should be pending
      expect(mockFn).not.toHaveBeenCalled();
      expect(debouncedFn.pending()).toBe(true);

      // Complete the debounce
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call-9'); // Last arguments
    });

    it('should handle mixed leading, trailing, and maxWait options', () => {
      const mockFn = jest.fn() as jest.MockedFunction<(arg: string) => void>;
      const debouncedFn = debounce(mockFn, 200, {
        leading: true,
        trailing: true,
        maxWait: 300,
      });

      // First call - leading
      debouncedFn('first');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      // Subsequent calls within debounce period
      jest.advanceTimersByTime(50);
      debouncedFn('second');

      jest.advanceTimersByTime(50);
      debouncedFn('third');

      jest.advanceTimersByTime(50);
      debouncedFn('fourth');

      // Wait for trailing call
      jest.advanceTimersByTime(200);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('fourth');
    });

    it('should maintain separate state for multiple debounced functions', () => {
      const mockFn1 = jest.fn() as jest.MockedFunction<(arg: string) => void>;
      const mockFn2 = jest.fn() as jest.MockedFunction<(arg: string) => void>;
      const debouncedFn1 = debounce(mockFn1, 100);
      const debouncedFn2 = debounce(mockFn2, 200);

      debouncedFn1('fn1');
      debouncedFn2('fn2');

      jest.advanceTimersByTime(100);
      expect(mockFn1).toHaveBeenCalledWith('fn1');
      expect(mockFn1).toHaveBeenCalledTimes(1);
      expect(mockFn2).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn2).toHaveBeenCalledWith('fn2');
      expect(mockFn2).toHaveBeenCalledTimes(1);
    });

    it('should handle function that throws error', () => {
      const errorFn = jest.fn(() => {
        throw new Error('Test error');
      });
      const debouncedFn = debounce(errorFn, 100);

      debouncedFn();

      expect(() => {
        jest.advanceTimersByTime(100);
      }).toThrow('Test error');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero wait time', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn();
      jest.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle very large wait times', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100000);

      debouncedFn();
      expect(debouncedFn.pending()).toBe(true);

      // Advance by less than the wait time
      jest.advanceTimersByTime(50000);
      expect(mockFn).not.toHaveBeenCalled();
      expect(debouncedFn.pending()).toBe(true);

      jest.advanceTimersByTime(50000);
      expect(mockFn).toHaveBeenCalled();
      expect(debouncedFn.pending()).toBe(false);
    });

    it('should handle functions with no return value', () => {
      const voidFn = jest.fn();
      const debouncedFn = debounce(voidFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(100);

      expect(voidFn).toHaveBeenCalledTimes(1);
    });

    it('should handle functions that return falsy values', () => {
      const falsyFn = jest.fn(() => 0);
      const debouncedFn = debounce(falsyFn, 100, { leading: true });

      const result = debouncedFn();
      expect(result).toBe(0);
    });
  });
});
