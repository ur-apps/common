import { pick } from './pick';

describe('[utils] pick', () => {
  const obj = {
    a: 1,
    b: 'hello',
    c: true,
    d: undefined,
    e: null,
    f: { nested: 'value' },
    g: [1, 2, 3],
    h: Symbol('test'),
    i: BigInt(123),
  };

  it('should pick existing keys', () => {
    const picked = pick(obj, ['a', 'c']);

    expect(picked).toEqual({ a: 1, c: true });
  });

  it('should pick all keys when all are specified', () => {
    const picked = pick(obj, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']);

    expect(picked).toEqual(obj);
  });

  it('should pick single key', () => {
    const picked = pick(obj, ['b']);

    expect(picked).toEqual({ b: 'hello' });
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
    expect(picked.f).toBe(obj.f); // Should reference the same object
  });

  it('should pick keys containing arrays', () => {
    const picked = pick(obj, ['g']);

    expect(picked).toEqual({ g: [1, 2, 3] });
    expect(picked.g).toBe(obj.g); // Should reference the same array
  });

  it('should pick keys with special types', () => {
    const picked = pick(obj, ['h', 'i']);

    expect(picked).toEqual({ h: obj.h, i: obj.i });
  });

  it('should return an empty object when picking from an empty object', () => {
    const emptyObj: Record<string, unknown> = {};
    const picked = pick(emptyObj, ['a']);

    expect(picked).toEqual({});
  });

  it('should return an empty object when no keys are provided', () => {
    const picked = pick(obj, []);

    expect(picked).toEqual({});
  });

  it('should handle mixed existing and non-existing keys', () => {
    // @ts-expect-error - Testing mixed keys
    const picked = pick(obj, ['a', 'nonexistent', 'b']);

    expect(picked).toEqual({ a: 1, b: 'hello' });
  });

  it('should work with objects having prototype properties', () => {
    class TestClass {
      public inherited = 'inherited';
      public own = 'own';
    }

    const instance = new TestClass();
    const picked = pick(instance, ['own', 'inherited']);

    expect(picked).toEqual({ own: 'own', inherited: 'inherited' });
  });

  it('should maintain type safety', () => {
    interface User {
      id: number;
      name: string;
      email: string;
      age: number;
    }

    const user: User = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      age: 30,
    };

    const userBasicInfo = pick(user, ['id', 'name']);

    // Type should be Pick<User, 'id' | 'name'>
    expect(userBasicInfo).toEqual({ id: 1, name: 'John' });
    expect(typeof userBasicInfo.id).toBe('number');
    expect(typeof userBasicInfo.name).toBe('string');
  });

  it('should not modify the original object', () => {
    const original = { ...obj };
    pick(obj, ['a', 'b']);

    expect(obj).toEqual(original);
  });
});
