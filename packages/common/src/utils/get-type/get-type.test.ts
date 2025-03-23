import { getType } from './get-type';

describe('getType function', () => {
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
