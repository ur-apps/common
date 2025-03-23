import { pick } from './pick';

describe('pick function', () => {
  const obj = {
    a: 1,
    b: 'hello',
    c: true,
    d: undefined,
    e: null,
    f: { nested: 'value' },
  };

  it('should pick existing keys', () => {
    const picked = pick(obj, ['a', 'c']);
    expect(picked).toEqual({ a: 1, c: true });
  });

  it('should return an empty object when picking non-existing keys', () => {
    // @ts-expect-error - Testing non-existing keys
    const picked = pick(obj, ['x', 'y']);
    expect(picked).toEqual({});
  });

  it('should pick keys including undefined and null values', () => {
    const picked = pick(obj, ['d', 'e']);
    expect(picked).toEqual({ d: undefined, e: null });
  });

  it('should pick keys containing nested objects', () => {
    const picked = pick(obj, ['f']);
    expect(picked).toEqual({ f: { nested: 'value' } });
  });

  it('should return an empty object when picking from an empty object', () => {
    const emptyObj: Record<string, unknown> = {};
    const picked = pick(emptyObj, ['a']);
    expect(picked).toEqual({});
  });
});
