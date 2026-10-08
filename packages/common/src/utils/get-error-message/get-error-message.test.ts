import { getErrorMessage } from './get-error-message';

describe('[utils] getErrorMessage', () => {
  it('should return the message of an error', () => {
    expect(getErrorMessage(new Error('Something went wrong'))).toBe('Something went wrong');
  });

  it('should return the name of an error with an empty message', () => {
    expect(getErrorMessage(new Error(''))).toBe('Error');
    expect(getErrorMessage(new TypeError(''))).toBe('TypeError');
  });

  it('should join the message and the causes of an aggregate error', () => {
    const error = new AggregateError([new Error('first'), new Error('second')], 'Failed');

    expect(getErrorMessage(error)).toBe('Failed: first; second');
  });

  it('should return only the causes of an aggregate error with an empty message', () => {
    const error = new AggregateError([
      new Error('connect ECONNREFUSED ::1:5432'),
      new Error('connect ECONNREFUSED 127.0.0.1:5432'),
    ]);

    expect(getErrorMessage(error)).toBe('connect ECONNREFUSED ::1:5432; connect ECONNREFUSED 127.0.0.1:5432');
  });

  it('should return only the message of an aggregate error without causes', () => {
    expect(getErrorMessage(new AggregateError([], 'Failed'))).toBe('Failed');
  });

  it('should return the name of an aggregate error without a message and causes', () => {
    expect(getErrorMessage(new AggregateError([]))).toBe('AggregateError');
  });

  it('should resolve nested aggregate errors', () => {
    const error = new AggregateError(
      [new AggregateError([new Error('inner')], 'Nested'), new Error('outer')],
      'Failed'
    );

    expect(getErrorMessage(error)).toBe('Failed: Nested: inner; outer');
  });

  it('should convert non-error causes of an aggregate error', () => {
    const error = new AggregateError(['text', { code: 1 }], 'Failed');

    expect(getErrorMessage(error)).toBe('Failed: text; {"code":1}');
  });

  it('should serialize plain objects', () => {
    expect(getErrorMessage({ status: 500, message: 'Failed' })).toBe('{"status":500,"message":"Failed"}');
  });

  it('should serialize arrays', () => {
    expect(getErrorMessage([1, 'two'])).toBe('[1,"two"]');
  });

  it('should fall back to String for objects with a circular reference', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(getErrorMessage(circular)).toBe('[object Object]');
  });

  it('should fall back to String for objects that contain a bigint', () => {
    expect(getErrorMessage({ value: 5n })).toBe('[object Object]');
  });

  it('should convert primitives to a string', () => {
    expect(getErrorMessage('text')).toBe('text');
    expect(getErrorMessage(404)).toBe('404');
    expect(getErrorMessage(true)).toBe('true');
    expect(getErrorMessage(5n)).toBe('5');
    expect(getErrorMessage(Symbol('id'))).toBe('Symbol(id)');
  });

  it('should convert null and undefined to a string', () => {
    expect(getErrorMessage(null)).toBe('null');
    expect(getErrorMessage(undefined)).toBe('undefined');
  });
});
