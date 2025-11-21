// import debounce from 'lodash.debounce';

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
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: false, logging: false });

      debouncedFn(); // Should execute immediately (leading)
      expect(mockFn).toHaveBeenCalledTimes(1);

      debouncedFn(); // Should not execute (within wait period)
      jest.advanceTimersByTime(50);
      debouncedFn(); // Should not execute (within wait period)
      jest.advanceTimersByTime(50); // Wait period expires
      expect(mockFn).toHaveBeenCalledTimes(1); // Still 1, no trailing call

      // After wait period, next call should execute immediately again
      jest.advanceTimersByTime(50);
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should execute both leading and trailing when both are true', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: true });

      debouncedFn(); // Leading call
      debouncedFn(); // Resets timer
      debouncedFn(); // Resets timer

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should execute new leading call after wait period has passed', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, trailing: true, logging: false });

      debouncedFn(0); // First leading call
      expect(mockFn).toHaveBeenCalledTimes(1);

      debouncedFn();
      jest.advanceTimersByTime(25);
      debouncedFn();
      jest.advanceTimersByTime(25);
      debouncedFn();
      jest.advanceTimersByTime(25);
      debouncedFn();
      jest.advanceTimersByTime(25);
      debouncedFn();
      jest.advanceTimersByTime(25);
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(75);
      expect(mockFn).toHaveBeenCalledTimes(2);
      debouncedFn(); // Second leading call after trailing call
      expect(mockFn).toHaveBeenCalledTimes(3);

      debouncedFn();
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(3);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(4);
      jest.advanceTimersByTime(200);
      debouncedFn(); // Second leading call after wait period
      expect(mockFn).toHaveBeenCalledTimes(5);
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
    it('22220202002020202020 should execute after maxWait period even with continuous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { maxWait: 200, logging: false });

      debouncedFn();
      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      debouncedFn();
      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      debouncedFn();
      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      debouncedFn();
      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1); // Called at maxWait
    });

    it('22220202002020202020 should respect maxWait with leading option', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150, logging: false });

      debouncedFn(); // Leading call
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(75);
      debouncedFn(); // Reset timer but within maxWait

      jest.advanceTimersByTime(75); // Total 150ms, should trigger maxWait
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    // it('should use minimum of wait and remaining maxWait time', () => {
    //   const mockFn = jest.fn();
    //   const debouncedFn = debounce(mockFn, 200, { maxWait: 100 });

    //   debouncedFn();
    //   jest.advanceTimersByTime(100); // Should trigger maxWait, not wait

    //   expect(mockFn).toHaveBeenCalledTimes(1);
    // });

    it('Сценарий 1: Одиночный вызов', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      // t=0: вызов
      debouncedFn();

      // Leading срабатывает сразу
      expect(mockFn).toHaveBeenCalledTimes(1);

      // t=100: trailing срабатывает
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('Сценарий 2: Два вызова с паузой < wait', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      // t=0: первый вызов → leading invoke
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      // t=50: второй вызов
      jest.advanceTimersByTime(50);
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1); // только leading

      // t=150: trailing срабатывает (100ms после последнего вызова на t=50)
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('Сценарий 3: Частые вызовы, срабатывает maxWait', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150, logging: false });

      // t=0: первый вызов → leading invoke
      debouncedFn('call-1');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith('call-1');

      // t=50: вызов
      jest.advanceTimersByTime(50);
      debouncedFn('call-2');
      expect(mockFn).toHaveBeenCalledTimes(1);

      // t=100: вызов
      jest.advanceTimersByTime(50);
      debouncedFn('call-3');
      expect(mockFn).toHaveBeenCalledTimes(1);

      // t=140: вызов
      jest.advanceTimersByTime(40);
      debouncedFn('call-4');
      expect(mockFn).toHaveBeenCalledTimes(1);

      // t=150: maxWait срабатывает (150ms от первого вызова)
      jest.advanceTimersByTime(10);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('call-4');

      // t=250: trailing
      debouncedFn('call-5');
      expect(mockFn).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith('call-5');
    });

    it('Сценарий 4: Вызовы продолжаются после maxWait', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      // t=0: leading invoke
      debouncedFn('call-1');
      expect(mockFn).toHaveBeenCalledTimes(1);

      // t=50, 100, 140: вызовы
      jest.advanceTimersByTime(50);
      debouncedFn('call-2');

      jest.advanceTimersByTime(50);
      debouncedFn('call-3');

      jest.advanceTimersByTime(40);
      debouncedFn('call-4');

      // t=150: maxWait invoke
      jest.advanceTimersByTime(10);
      expect(mockFn).toHaveBeenCalledTimes(2);

      // t=160: новый вызов ПОСЛЕ maxWait
      jest.advanceTimersByTime(10);
      debouncedFn('call-5');
      expect(mockFn).toHaveBeenCalledTimes(2); // maxWait таймер заново запустился

      // t=260: trailing invoke (100ms после последнего вызова)
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith('call-5');
    });

    it('Сценарий 5: Новая серия после полной паузы', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150, logging: false });

      // Первая серия
      debouncedFn('series-1');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('series-1');

      // Пауза 200ms
      jest.advanceTimersByTime(200);

      // Новая серия - снова leading
      debouncedFn('series-2');
      expect(mockFn).toHaveBeenCalledTimes(2); // новый leading
      expect(mockFn).toHaveBeenCalledWith('series-2');
    });

    it('Сценарий 6: maxWait срабатывает точно на границе', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Вызовы каждые 40ms
      for (let i = 0; i < 5; i++) {
        jest.advanceTimersByTime(40);
        debouncedFn(`call-${i}`);
      }

      // t=200: уже прошло 150ms от первого вызова
      // maxWait должен был сработать на t=150
      expect(mockFn).toHaveBeenCalledTimes(2); // leading + maxWait
    });

    it('Сценарий 7: cancel отменяет trailing но не влияет на leading', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1); // leading

      jest.advanceTimersByTime(50);
      debouncedFn.cancel();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1); // trailing отменён
    });

    it('Сценарий 8: flush вызывает pending trailing немедленно', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { leading: true, maxWait: 150 });

      debouncedFn('test');
      expect(mockFn).toHaveBeenCalledTimes(1); // leading

      jest.advanceTimersByTime(50);
      debouncedFn('test2');

      debouncedFn.flush();
      expect(mockFn).toHaveBeenCalledTimes(2); // trailing выполнен досрочно
      expect(mockFn).toHaveBeenLastCalledWith('test2');
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

    it('22220202002020202020 should', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500, {
        leading: false,
        trailing: true,
        maxWait: 1000,
        logging: false,
      });

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      debouncedFn();
      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(2000);
      expect(mockFn).toHaveBeenCalledTimes(1);

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
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

  describe.skip('debounce - exact reproduction from logs', () => {
    test('Полная последовательность', () => {
      const start = Date.now();
      const mockFn = jest.fn((str: string) => console.log(str, ':arg | envoked at:', Date.now() - start));
      const debouncedFn = debounce(mockFn, 1000, {
        leading: false,
        trailing: true,
        maxWait: 1000,
        logging: false,
      });

      console.log('1'.repeat(20));
      jest.advanceTimersByTime(1254);
      debouncedFn('1254');
      jest.advanceTimersByTime(1461 - 1254);
      debouncedFn('1461');
      expect(mockFn).toHaveBeenCalledTimes(0);
      jest.advanceTimersByTime(2257 - 1461);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith('1461');

      console.log('2'.repeat(20));
      jest.advanceTimersByTime(6898 - 2257);
      debouncedFn('6898');
      jest.advanceTimersByTime(7079 - 6898);
      debouncedFn('7079');
      jest.advanceTimersByTime(7267 - 7079);
      debouncedFn('7267');
      jest.advanceTimersByTime(7437 - 7267);
      debouncedFn('7437');
      jest.advanceTimersByTime(7613 - 7437);
      debouncedFn('7613');
      expect(mockFn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(7900 - 7613);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('7613');

      console.log('3'.repeat(20));
      jest.advanceTimersByTime(10082 - 7900);
      debouncedFn('10082');
      jest.advanceTimersByTime(10258 - 10082);
      debouncedFn('10258');
      jest.advanceTimersByTime(10416 - 10258);
      debouncedFn('10416');
      jest.advanceTimersByTime(10610 - 10416);
      debouncedFn('10610');
      jest.advanceTimersByTime(10779 - 10610);
      debouncedFn('10779');
      jest.advanceTimersByTime(10954 - 10779);
      debouncedFn('10954');
      expect(mockFn).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(11083 - 10954);
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith('10954');

      console.log('4'.repeat(20));
      jest.advanceTimersByTime(11113 - 11083);
      debouncedFn('11113');
      jest.advanceTimersByTime(11297 - 11113);
      debouncedFn('11297');
      jest.advanceTimersByTime(11472 - 11297);
      debouncedFn('11472');
      jest.advanceTimersByTime(11720 - 11472);
      debouncedFn('11720');
      jest.advanceTimersByTime(11896 - 11720);
      debouncedFn('11896');
      jest.advanceTimersByTime(12073 - 11896);
      debouncedFn('12073');
      expect(mockFn).toHaveBeenCalledTimes(3);
      jest.advanceTimersByTime(12115 - 12073);
      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(mockFn).toHaveBeenLastCalledWith('12073');

      console.log('5'.repeat(20));
      jest.advanceTimersByTime(12248 - 12115);
      debouncedFn('12248');
      jest.advanceTimersByTime(12418 - 12248);
      debouncedFn('12418');
      expect(mockFn).toHaveBeenCalledTimes(4);
      jest.advanceTimersByTime(13250 - 12418);
      expect(mockFn).toHaveBeenCalledTimes(5);
      expect(mockFn).toHaveBeenLastCalledWith('12418');

      console.log('6'.repeat(20));
      jest.advanceTimersByTime(16165 - 13250);
      debouncedFn('16165');
      jest.advanceTimersByTime(16331 - 16165);
      debouncedFn('16331');
      jest.advanceTimersByTime(16678 - 16331);
      debouncedFn('16678');
      expect(mockFn).toHaveBeenCalledTimes(5);
      jest.advanceTimersByTime(17167 - 16678);
      expect(mockFn).toHaveBeenCalledTimes(6);
      expect(mockFn).toHaveBeenLastCalledWith('16678');

      console.log('7'.repeat(20));
      jest.advanceTimersByTime(18087 - 17167);
      debouncedFn('18087');
      jest.advanceTimersByTime(18297 - 18087);
      debouncedFn('18297');
      jest.advanceTimersByTime(18456 - 18297);
      debouncedFn('18456');
      jest.advanceTimersByTime(18613 - 18456);
      debouncedFn('18613');
      jest.advanceTimersByTime(18790 - 18613);
      debouncedFn('18790');
      jest.advanceTimersByTime(18978 - 18790);
      debouncedFn('18978');
      expect(mockFn).toHaveBeenCalledTimes(6);
      jest.advanceTimersByTime(19090 - 18978);
      expect(mockFn).toHaveBeenCalledTimes(7);
      expect(mockFn).toHaveBeenLastCalledWith('18978');

      console.log('8'.repeat(20));
      jest.advanceTimersByTime(19129 - 19090);
      debouncedFn('19129');
      jest.advanceTimersByTime(19305 - 19129);
      debouncedFn('19305');
      jest.advanceTimersByTime(19480 - 19305);
      debouncedFn('19480');
      jest.advanceTimersByTime(19648 - 19480);
      debouncedFn('19648');
      jest.advanceTimersByTime(19839 - 19648);
      debouncedFn('19839');
      jest.advanceTimersByTime(20033 - 19839);
      debouncedFn('20033');
      expect(mockFn).toHaveBeenCalledTimes(7);
      jest.advanceTimersByTime(20131 - 20033);
      expect(mockFn).toHaveBeenCalledTimes(8);
      expect(mockFn).toHaveBeenLastCalledWith('20033');

      console.log('9'.repeat(20));
      jest.advanceTimersByTime(20225 - 20131);
      debouncedFn('20225');
      jest.advanceTimersByTime(20410 - 20225);
      debouncedFn('20410');
      jest.advanceTimersByTime(20591 - 20410);
      debouncedFn('20591');
      jest.advanceTimersByTime(20786 - 20591);
      debouncedFn('20786');
      jest.advanceTimersByTime(20968 - 20786);
      debouncedFn('20968');
      jest.advanceTimersByTime(21162 - 20968);
      debouncedFn('21162');
      expect(mockFn).toHaveBeenCalledTimes(9);
      jest.advanceTimersByTime(21162 - 21162);
      expect(mockFn).toHaveBeenCalledTimes(9);
      expect(mockFn).toHaveBeenLastCalledWith('21162');

      console.log('10_'.repeat(10));
      jest.advanceTimersByTime(21344 - 21162);
      debouncedFn('21344');
      jest.advanceTimersByTime(21532 - 21344);
      debouncedFn('21532');
      jest.advanceTimersByTime(21708 - 21532);
      debouncedFn('21708');
      jest.advanceTimersByTime(21891 - 21708);
      debouncedFn('21891');
      jest.advanceTimersByTime(22077 - 21891);
      debouncedFn('22077');
      expect(mockFn).toHaveBeenCalledTimes(9);
      jest.advanceTimersByTime(22164 - 22077);
      expect(mockFn).toHaveBeenCalledTimes(10);
      expect(mockFn).toHaveBeenLastCalledWith('22077');

      console.log('11_'.repeat(10));
      jest.advanceTimersByTime(22266 - 22164);
      debouncedFn('22266');
      expect(mockFn).toHaveBeenCalledTimes(10);
      jest.advanceTimersByTime(23268 - 22266);
      expect(mockFn).toHaveBeenCalledTimes(11);
      expect(mockFn).toHaveBeenLastCalledWith('22266');
    });
  });
});
