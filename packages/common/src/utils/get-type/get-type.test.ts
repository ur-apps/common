import {
  getType,
  isAllowedType,
  isArray,
  isBigInt,
  isBoolean,
  isDate,
  isNull,
  isNullish,
  isNumber,
  isObject,
  isString,
  isSymbol,
  isUndefined,
} from './get-type';

describe('[utils] getType', () => {
  it('should identify strings', () => {
    expect(getType('Hello')).toBe('string');
  });

  it('should identify numbers', () => {
    expect(getType(5)).toBe('number');
  });

  it('should identify bigints', () => {
    expect(getType(5n)).toBe('bigint');
  });

  it('should identify booleans', () => {
    expect(getType(true)).toBe('boolean');
  });

  it('should identify symbols', () => {
    expect(getType(Symbol('test'))).toBe('symbol');
  });

  it('should identify null', () => {
    expect(getType(null)).toBe('null');
  });

  it('should identify undefined', () => {
    expect(getType(undefined)).toBe('undefined');
  });

  it('should identify objects', () => {
    expect(getType({ key: 'value' })).toBe('object');
  });

  it('should identify arrays', () => {
    expect(getType([1, 2, 3])).toBe('array');
  });

  it('should identify dates', () => {
    expect(getType(new Date())).toBe('date');
  });

  it('should identify functions', () => {
    expect(
      getType(() => {
        console.info('this is a function');
      })
    ).toBe('function');
  });
});

describe('[utils] isString', () => {
  it('should return true for strings', () => {
    expect(isString('Hello')).toBe(true);
    expect(isString('')).toBe(true);
    expect(isString('123')).toBe(true);
  });

  it('should return false for non-strings', () => {
    expect(isString(123)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(true)).toBe(false);
  });
});

describe('[utils] isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-123)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
    expect(isNumber(Number(42))).toBe(true);
    expect(isNumber(new Number(42))).toBe(true);
  });

  it('should return false for non-numbers and NaN', () => {
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(123n)).toBe(false);
    expect(isNumber('123')).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber(true)).toBe(false);
  });
});

describe('[utils] isBigInt', () => {
  it('should return true for bigints', () => {
    expect(isBigInt(123n)).toBe(true);
    expect(isBigInt(0n)).toBe(true);
    expect(isBigInt(-123n)).toBe(true);
    expect(isBigInt(BigInt(123))).toBe(true);
  });

  it('should return false for non-bigints', () => {
    expect(isBigInt(123)).toBe(false);
    expect(isBigInt('123')).toBe(false);
    expect(isBigInt(null)).toBe(false);
    expect(isBigInt(undefined)).toBe(false);
    expect(isBigInt([])).toBe(false);
    expect(isBigInt({})).toBe(false);
    expect(isBigInt(true)).toBe(false);
  });
});

describe('[utils] isBoolean', () => {
  it('should return true for booleans', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(new Boolean(true))).toBe(true);
    expect(isBoolean(new Boolean(false))).toBe(true);
  });

  it('should return false for non-booleans', () => {
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean('true')).toBe(false);
    expect(isBoolean('false')).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean([])).toBe(false);
    expect(isBoolean({})).toBe(false);
  });
});

describe('[utils] isSymbol', () => {
  it('should return true for symbols', () => {
    expect(isSymbol(Symbol())).toBe(true);
    expect(isSymbol(Symbol('test'))).toBe(true);
    expect(isSymbol(Symbol.for('test'))).toBe(true);
  });

  it('should return false for non-symbols', () => {
    expect(isSymbol('symbol')).toBe(false);
    expect(isSymbol(123)).toBe(false);
    expect(isSymbol(null)).toBe(false);
    expect(isSymbol(undefined)).toBe(false);
    expect(isSymbol([])).toBe(false);
    expect(isSymbol({})).toBe(false);
    expect(isSymbol(true)).toBe(false);
  });
});

describe('[utils] isDate', () => {
  it('should return true for dates', () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date('2023-01-01'))).toBe(true);
    expect(isDate(new Date(0))).toBe(true);
  });

  it('should return false for non-dates', () => {
    expect(isDate('2023-01-01')).toBe(false);
    expect(isDate(123456789)).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
    expect(isDate([])).toBe(false);
    expect(isDate({})).toBe(false);
    expect(isDate(true)).toBe(false);
  });
});

describe('[utils] isArray', () => {
  it('should return true for arrays', () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray(['a', 'b', 'c'])).toBe(true);
    expect(isArray(new Array(5))).toBe(true);
  });

  it('should return false for non-arrays', () => {
    expect(isArray('array')).toBe(false);
    expect(isArray(123)).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(true)).toBe(false);
    expect(isArray({ length: 0 })).toBe(false);
  });
});

describe('[utils] isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: 'value' })).toBe(true);
    expect(isObject(new Object())).toBe(true);
  });

  it('should return false for non-objects', () => {
    expect(isObject([])).toBe(false);
    expect(isObject(new Date())).toBe(false);
    expect(isObject('object')).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(
      isObject(() => {
        return 42;
      })
    ).toBe(false);
  });
});

describe('[utils] isNull', () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false for non-null values', () => {
    expect(isNull(undefined)).toBe(false);
    expect(isNull(0)).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull(false)).toBe(false);
    expect(isNull([])).toBe(false);
    expect(isNull({})).toBe(false);
    expect(isNull('null')).toBe(false);
  });
});

describe('[utils] isUndefined', () => {
  it('should return true for undefined', () => {
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(void 0)).toBe(true);
  });

  it('should return false for non-undefined values', () => {
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(false)).toBe(false);
    expect(isUndefined([])).toBe(false);
    expect(isUndefined({})).toBe(false);
    expect(isUndefined('undefined')).toBe(false);
  });
});

describe('[utils] isNullish', () => {
  it('should return true for null and undefined', () => {
    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
    expect(isNullish(void 0)).toBe(true);
  });

  it('should return false for non-nullish values', () => {
    expect(isNullish(0)).toBe(false);
    expect(isNullish('')).toBe(false);
    expect(isNullish(false)).toBe(false);
    expect(isNullish([])).toBe(false);
    expect(isNullish({})).toBe(false);
    expect(isNullish('null')).toBe(false);
    expect(isNullish('undefined')).toBe(false);
  });
});

describe('[utils] isAllowedType', () => {
  it('should return true when value type is in allowed types', () => {
    expect(isAllowedType('hello', ['string'])).toBe(true);
    expect(isAllowedType(123, ['number'])).toBe(true);
    expect(isAllowedType([], ['array'])).toBe(true);
    expect(isAllowedType({}, ['object'])).toBe(true);
    expect(isAllowedType(null, ['null'])).toBe(true);
    expect(isAllowedType(undefined, ['undefined'])).toBe(true);
    expect(isAllowedType('test', ['string', 'number'])).toBe(true);
    expect(isAllowedType(42, ['string', 'number'])).toBe(true);
  });

  it('should return false when value type is not in allowed types', () => {
    expect(isAllowedType('hello', ['number'])).toBe(false);
    expect(isAllowedType(123, ['string'])).toBe(false);
    expect(isAllowedType([], ['object'])).toBe(false);
    expect(isAllowedType({}, ['array'])).toBe(false);
    expect(isAllowedType(null, ['undefined'])).toBe(false);
    expect(isAllowedType(undefined, ['null'])).toBe(false);
    expect(isAllowedType(true, ['string', 'number'])).toBe(false);
  });

  it('should handle empty allowed types array', () => {
    expect(isAllowedType('test', [])).toBe(false);
    expect(isAllowedType(123, [])).toBe(false);
    expect(isAllowedType(null, [])).toBe(false);
  });
});
