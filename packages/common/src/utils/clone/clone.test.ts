import { clone, cloneArray, cloneDate, cloneMap, cloneObject, cloneSet } from './clone';

describe('[utils] clone', () => {
  it('should clone primitive types without modification', () => {
    // Arrange
    const numberValue = 42;
    const stringValue = 'Hello, world!';
    const booleanValue = true;
    const nullValue = null;
    const undefinedValue = undefined;
    const symbolValue = Symbol('test');
    const bigintValue = 123n;

    // Act
    const clonedNumber = clone(numberValue);
    const clonedString = clone(stringValue);
    const clonedBoolean = clone(booleanValue);
    const clonedNull = clone(nullValue);
    const clonedUndefined = clone(undefinedValue);
    const clonedSymbol = clone(symbolValue);
    const clonedBigint = clone(bigintValue);

    // Assert
    expect(clonedNumber).toBe(numberValue);
    expect(clonedString).toBe(stringValue);
    expect(clonedBoolean).toBe(booleanValue);
    expect(clonedNull).toBe(nullValue);
    expect(clonedUndefined).toBe(undefinedValue);
    expect(clonedSymbol).toBe(symbolValue);
    expect(clonedBigint).toBe(bigintValue);
  });

  it('should clone arrays correctly', () => {
    // Arrange
    const originalArray = [1, 'two', { key: 'value' }];

    // Act
    const clonedArray = clone(originalArray);

    // Assert
    expect(clonedArray).toEqual(originalArray);
    expect(clonedArray).not.toBe(originalArray); // Check for reference equality
    expect(clonedArray[2]).not.toBe(originalArray[2]); // Check for reference equality
  });

  it('should clone nested arrays correctly', () => {
    // Arrange
    const nestedArray = [1, [2, [3, 4]], { nested: [5, 6] }];

    // Act
    const clonedArray = clone(nestedArray);

    // Assert
    expect(clonedArray).toEqual(nestedArray);
    expect(clonedArray).not.toBe(nestedArray);
    expect(clonedArray[1]).not.toBe(nestedArray[1]);
    expect(clonedArray[1][1]).not.toBe(nestedArray[1][1]);
  });

  it('should clone objects correctly', () => {
    // Arrange
    const originalObject = {
      key1: 'value1',
      key2: [1, 2, 3],
      key3: { nestedKey: 'nestedValue' },
    };

    // Act
    const clonedObject = clone(originalObject);

    // Assert
    expect(clonedObject).toEqual(originalObject);
    expect(clonedObject).not.toBe(originalObject); // Check for reference equality
    expect(clonedObject.key2).not.toBe(originalObject.key2); // Check for reference equality
    expect(clonedObject.key3).not.toBe(originalObject.key3); // Check for reference equality
  });

  it('should clone Sets correctly', () => {
    // Arrange
    const originalSet = new Set([1, 'two', { key: 'value' }]);

    // Act
    const clonedSet = clone(originalSet);

    // Assert
    expect(clonedSet).toEqual(originalSet);
    expect(clonedSet).not.toBe(originalSet);
    expect(clonedSet.size).toBe(originalSet.size);
  });

  it('should clone Maps correctly', () => {
    // Arrange
    const originalMap = new Map<unknown, unknown>([
      ['key1', 'value1'],
      [2, { nested: 'object' }],
      [{ objKey: true }, 'value3'],
    ]);

    // Act
    const clonedMap = clone(originalMap);

    // Assert
    expect(clonedMap).toEqual(originalMap);
    expect(clonedMap).not.toBe(originalMap);
    expect(clonedMap.size).toBe(originalMap.size);
  });

  it('should clone Dates correctly', () => {
    // Arrange
    const originalDate = new Date('2023-01-01T00:00:00.000Z');

    // Act
    const clonedDate = clone(originalDate);

    // Assert
    expect(clonedDate).toEqual(originalDate);
    expect(clonedDate).not.toBe(originalDate);
    expect(clonedDate.getTime()).toBe(originalDate.getTime());
  });

  it('should handle cloning of objects with functions', () => {
    // Arrange
    const originalObject = {
      key: 'value',
      func: function () {
        console.info('Original function');
      },
    };

    // Act
    const clonedObject = clone(originalObject);

    // Assert
    expect(clonedObject).toEqual(originalObject);
    expect(clonedObject.func).toBe(originalObject.func); // Functions should be copied by reference
  });

  it('should handle cloning of objects with circular references', () => {
    // Arrange
    const circularObject: Record<string, unknown> = { prop: 'value' };
    circularObject.circularReference = circularObject;

    // Act
    const clonedCircularObject = clone(circularObject);

    // Assert
    expect(clonedCircularObject).toEqual(circularObject);
    expect(clonedCircularObject.circularReference).toBe(clonedCircularObject); // Circular reference should be maintained
  });

  it('should handle cloning of arrays with circular references', () => {
    // Arrange
    const circularArray: unknown[] = [1, 2];
    circularArray.push(circularArray);

    // Act
    const clonedArray = clone(circularArray);

    // Assert
    expect(clonedArray[0]).toBe(1);
    expect(clonedArray[1]).toBe(2);
    expect(clonedArray[2]).toBe(clonedArray);
    expect(clonedArray).not.toBe(circularArray);
  });

  it('should handle cloning of objects with specific types', () => {
    // Arrange
    class CustomType {
      constructor(public prop: string) {}
    }

    const originalObject = {
      customTypeInstance: new CustomType('customValue'),
    };

    // Act
    const clonedObject = clone(originalObject);

    // Assert
    expect(clonedObject).toEqual(originalObject);
  });
});

describe('[utils] cloneObject', () => {
  it('should clone simple objects', () => {
    // Arrange
    const obj = { a: 1, b: 'test', c: true };

    // Act
    const cloned = cloneObject(obj);

    // Assert
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });

  it('should clone nested objects', () => {
    // Arrange
    const obj = {
      level1: {
        level2: {
          value: 'deep',
        },
      },
    };

    // Act
    const cloned = cloneObject(obj);

    // Assert
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.level1).not.toBe(obj.level1);
    expect(cloned.level1.level2).not.toBe(obj.level1.level2);
  });

  it('should handle circular references', () => {
    // Arrange
    const obj: Record<string, unknown> = { prop: 'value' };
    obj.self = obj;

    // Act
    const cloned = cloneObject(obj);

    // Assert
    expect(cloned.prop).toBe('value');
    expect(cloned.self).toBe(cloned);
    expect(cloned).not.toBe(obj);
  });

  it('should clone objects with arrays', () => {
    // Arrange
    const obj = {
      numbers: [1, 2, 3],
      nested: { items: ['a', 'b'] },
    };

    // Act
    const cloned = cloneObject(obj);

    // Assert
    expect(cloned).toEqual(obj);
    expect(cloned.numbers).not.toBe(obj.numbers);
    expect(cloned.nested.items).not.toBe(obj.nested.items);
  });
});

describe('[utils] cloneArray', () => {
  it('should clone simple arrays', () => {
    // Arrange
    const arr = [1, 'test', true, null];

    // Act
    const cloned = cloneArray(arr);

    // Assert
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
  });

  it('should clone nested arrays', () => {
    // Arrange
    const arr = [1, [2, [3, 4]], 5];

    // Act
    const cloned = cloneArray(arr);

    // Assert
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[1]).not.toBe(arr[1]);
    expect((cloned[1] as number[])[1]).not.toBe((arr[1] as number[])[1]);
  });

  it('should clone arrays with objects', () => {
    // Arrange
    const arr = [{ a: 1 }, { b: { c: 2 } }];

    // Act
    const cloned = cloneArray(arr);

    // Assert
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[0]).not.toBe(arr[0]);
    expect(cloned[1]).not.toBe(arr[1]);
  });

  it('should handle circular references', () => {
    // Arrange
    const arr: unknown[] = [1, 2];
    arr.push(arr);

    // Act
    const cloned = cloneArray(arr);

    // Assert
    expect(cloned[0]).toBe(1);
    expect(cloned[1]).toBe(2);
    expect(cloned[2]).toBe(cloned);
    expect(cloned).not.toBe(arr);
  });
});

describe('[utils] cloneSet', () => {
  it('should clone Sets with primitive values', () => {
    // Arrange
    const set = new Set([1, 'test', true, null]);

    // Act
    const cloned = cloneSet(set);

    // Assert
    expect(cloned).toEqual(set);
    expect(cloned).not.toBe(set);
    expect(cloned.size).toBe(set.size);
  });

  it('should clone Sets with objects', () => {
    // Arrange
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const set = new Set([obj1, obj2]);

    // Act
    const cloned = cloneSet(set);

    // Assert
    expect(cloned.size).toBe(set.size);
    expect(cloned).not.toBe(set);

    const clonedValues = Array.from(cloned);
    const originalValues = Array.from(set);
    expect(clonedValues[0]).toEqual(originalValues[0]);
    expect(clonedValues[0]).not.toBe(originalValues[0]);
  });

  it('should clone empty Sets', () => {
    // Arrange
    const set = new Set();

    // Act
    const cloned = cloneSet(set);

    // Assert
    expect(cloned).toEqual(set);
    expect(cloned).not.toBe(set);
    expect(cloned.size).toBe(0);
  });

  it('should handle circular references in Sets', () => {
    // Arrange
    const obj: Record<string, unknown> = { prop: 'value' };
    obj.self = obj;
    const set = new Set([obj]);

    // Act
    const cloned = cloneSet(set);

    // Assert
    expect(cloned.size).toBe(1);
    expect(cloned).not.toBe(set);

    const clonedObj = Array.from(cloned)[0] as Record<string, unknown>;
    expect(clonedObj.prop).toBe('value');
    expect(clonedObj.self).toBe(clonedObj);
  });
});

describe('[utils] cloneMap', () => {
  it('should clone Maps with primitive values', () => {
    // Arrange
    const map = new Map<unknown, unknown>([
      ['key1', 'value1'],
      [2, 'value2'],
      [true, false],
    ]);

    // Act
    const cloned = cloneMap(map);

    // Assert
    expect(cloned).toEqual(map);
    expect(cloned).not.toBe(map);
    expect(cloned.size).toBe(map.size);
  });

  it('should clone Maps with object keys and values', () => {
    // Arrange
    const keyObj = { keyProp: 'key' };
    const valueObj = { valueProp: 'value' };
    const map = new Map([[keyObj, valueObj]]);

    // Act
    const cloned = cloneMap(map);

    // Assert
    expect(cloned.size).toBe(map.size);
    expect(cloned).not.toBe(map);

    const clonedEntries = Array.from(cloned.entries());
    const originalEntries = Array.from(map.entries());

    expect(clonedEntries[0][0]).toEqual(originalEntries[0][0]);
    expect(clonedEntries[0][0]).not.toBe(originalEntries[0][0]);
    expect(clonedEntries[0][1]).toEqual(originalEntries[0][1]);
    expect(clonedEntries[0][1]).not.toBe(originalEntries[0][1]);
  });

  it('should clone empty Maps', () => {
    // Arrange
    const map = new Map();

    // Act
    const cloned = cloneMap(map);

    // Assert
    expect(cloned).toEqual(map);
    expect(cloned).not.toBe(map);
    expect(cloned.size).toBe(0);
  });

  it('should handle circular references in Maps', () => {
    // Arrange
    const obj: Record<string, unknown> = { prop: 'value' };
    obj.self = obj;
    const map = new Map([['key', obj]]);

    // Act
    const cloned = cloneMap(map);

    // Assert
    expect(cloned.size).toBe(1);
    expect(cloned).not.toBe(map);

    const clonedObj = cloned.get('key') as Record<string, unknown>;
    expect(clonedObj.prop).toBe('value');
    expect(clonedObj.self).toBe(clonedObj);
  });
});

describe('[utils] cloneDate', () => {
  it('should clone Date objects', () => {
    // Arrange
    const date = new Date('2023-01-01T12:00:00.000Z');

    // Act
    const cloned = cloneDate(date);

    // Assert
    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
    expect(cloned.getTime()).toBe(date.getTime());
  });

  it('should clone current date', () => {
    // Arrange
    const date = new Date();

    // Act
    const cloned = cloneDate(date);

    // Assert
    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
    expect(cloned.getTime()).toBe(date.getTime());
  });

  it('should clone invalid dates', () => {
    // Arrange
    const date = new Date('invalid');

    // Act
    const cloned = cloneDate(date);

    // Assert
    expect(cloned).not.toBe(date);
    expect(Number.isNaN(cloned.getTime())).toBe(true);
    expect(Number.isNaN(date.getTime())).toBe(true);
  });
});
