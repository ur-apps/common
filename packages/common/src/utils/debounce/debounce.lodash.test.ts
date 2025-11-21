/* eslint-disable no-undef */

// import debounce from 'lodash.debounce';

import { debounce } from './debounce';

describe('lodash.debounce', () => {
  const identity = (value: any) => value;

  test('should debounce a function', (done) => {
    expect.assertions(6);

    let callCount = 0;

    const debounced = debounce(function (value: any) {
      ++callCount;
      return value;
    }, 32);

    const results = [debounced('a'), debounced('b'), debounced('c')];
    expect(results).toEqual([undefined, undefined, undefined]);
    expect(callCount).toBe(0);

    setTimeout(() => {
      expect(callCount).toBe(1);

      const results = [debounced('d'), debounced('e'), debounced('f')];
      expect(results).toEqual(['c', 'c', 'c']);
      expect(callCount).toBe(1);
    }, 128);

    setTimeout(() => {
      expect(callCount).toBe(2);
      done();
    }, 256);
  });

  test('subsequent debounced calls return the last `func` result', (done) => {
    expect.assertions(2);

    const debounced = debounce(identity, 32);
    debounced('a');

    setTimeout(() => {
      expect(debounced('b')).not.toBe('b');
    }, 64);

    setTimeout(() => {
      expect(debounced('c')).not.toBe('c');
      done();
    }, 128);
  });

  test('should not immediately call `func` when `wait` is `0`', (done) => {
    expect.assertions(2);

    let callCount = 0;
    const debounced = debounce(function () {
      ++callCount;
    }, 0);

    debounced();
    debounced();
    expect(callCount).toBe(0);

    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 5);
  });

  test('should apply default options', (done) => {
    expect.assertions(2);

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

    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 64);
  });

  test('should support a `leading` option', (done) => {
    expect.assertions(4);

    const callCounts = [0, 0];

    const withLeading = debounce(
      function () {
        callCounts[0]++;
      },
      32,
      { 'leading': true }
    );

    const withLeadingAndTrailing = debounce(
      function () {
        callCounts[1]++;
      },
      32,
      { 'leading': true }
    );

    withLeading();
    expect(callCounts[0]).toBe(1);

    withLeadingAndTrailing();
    withLeadingAndTrailing();
    expect(callCounts[1]).toBe(1);

    setTimeout(() => {
      expect(callCounts).toEqual([1, 2]);

      withLeading();
      expect(callCounts[0]).toBe(2);

      done();
    }, 64);
  });

  test('subsequent leading debounced calls return the last `func` result', (done) => {
    expect.assertions(2);

    const debounced = debounce(identity, 32, { 'leading': true, 'trailing': false });
    const results = [debounced('a'), debounced('b')];

    expect(results).toEqual(['a', 'a']);

    setTimeout(() => {
      const results = [debounced('c'), debounced('d')];
      expect(results).toEqual(['c', 'c']);
      done();
    }, 64);
  });

  test('should support a `trailing` option', (done) => {
    expect.assertions(4);

    let withCount = 0;
    let withoutCount = 0;

    const withTrailing = debounce(
      function () {
        withCount++;
      },
      32,
      { 'trailing': true }
    );

    const withoutTrailing = debounce(
      function () {
        withoutCount++;
      },
      32,
      { 'trailing': false }
    );

    withTrailing();
    expect(withCount).toBe(0);

    withoutTrailing();
    expect(withoutCount).toBe(0);

    setTimeout(() => {
      expect(withCount).toBe(1);
      expect(withoutCount).toBe(0);
      done();
    }, 64);
  });

  test('should support a `maxWait` option', (done) => {
    expect.assertions(4);

    let callCount = 0;

    const debounced = debounce(
      function (value: any) {
        ++callCount;
        return value;
      },
      32,
      { 'maxWait': 64 }
    );

    debounced();
    debounced();
    expect(callCount).toBe(0);

    setTimeout(() => {
      expect(callCount).toBe(1);
      debounced();
      debounced();
      expect(callCount).toBe(1);
    }, 128);

    setTimeout(() => {
      expect(callCount).toBe(2);
      done();
    }, 256);
  });

  test('should support `maxWait` in a tight loop', (done) => {
    expect.assertions(1);

    const limit = 320;
    let withCount = 0;
    let withoutCount = 0;

    const withMaxWait = debounce(
      function () {
        withCount++;
      },
      64,
      { 'maxWait': 128, logging: false }
    );

    const withoutMaxWait = debounce(function () {
      withoutCount++;
    }, 96);

    const start = Date.now();
    while (Date.now() - start < limit) {
      withMaxWait();
      withoutMaxWait();
    }
    const actual = [Boolean(withoutCount), Boolean(withCount)];

    setTimeout(() => {
      expect(actual).toEqual([false, true]);
      done();
    }, 1);
  });

  test('should queue a trailing call for subsequent debounced calls after `maxWait`', (done) => {
    expect.assertions(1);

    let callCount = 0;

    const debounced = debounce(
      function () {
        ++callCount;
      },
      200,
      { 'maxWait': 200 }
    );

    debounced();

    setTimeout(debounced, 190);
    setTimeout(debounced, 200);
    setTimeout(debounced, 210);

    setTimeout(() => {
      expect(callCount).toBe(2);
      done();
    }, 500);
  });

  test('should cancel `maxDelayed` when `delayed` is invoked', (done) => {
    expect.assertions(2);

    let callCount = 0;

    const debounced = debounce(
      function () {
        callCount++;
      },
      32,
      { 'maxWait': 64 }
    );

    debounced();

    setTimeout(() => {
      debounced();
      expect(callCount).toBe(1);
    }, 128);

    setTimeout(() => {
      expect(callCount).toBe(2);
      done();
    }, 192);
  });

  test('should invoke the trailing call with the correct arguments and `this` binding', (done) => {
    expect.assertions(2);

    let actual: any[];
    let callCount = 0;
    const object = {};

    const debounced = debounce(
      function (value: any) {
        actual = [this, ...arguments];

        return ++callCount !== 2;
      },
      32,
      { 'leading': true, 'maxWait': 64 }
    );

    while (true) {
      if (!debounced.call(object, 'a')) {
        break;
      }
    }

    setTimeout(() => {
      expect(callCount).toBe(2);
      expect(actual).toEqual([object, 'a']);
      done();
    }, 64);
  });
});
