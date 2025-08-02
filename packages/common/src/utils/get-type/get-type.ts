/**
 * Types of values that can be returned by the getType function.
 */
export type TValueType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'null'
  | 'undefined'
  | 'object'
  | 'array'
  | 'date'
  | 'function';

/**
 * Determines the type of the given value.
 * @param value - The value whose type needs to be determined.
 * @returns The type of the value.
 */
export function getType(value: unknown): TValueType {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  if (value instanceof Date) {
    return 'date';
  }

  return typeof value;
}

/**
 * Checks if the value is a string.
 * @param value - The value to check.
 * @returns true if the value is a string, otherwise false.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if the value is a number.
 * @param value - The value to check.
 * @returns true if the value is a number, otherwise false.
 */
export function isNumber(value: unknown): value is number {
  return (typeof value === 'number' || value instanceof Number) && !Number.isNaN(Number(value));
}

/**
 * Checks if the value is a bigint.
 * @param value - The value to check.
 * @returns true if the value is a bigint, otherwise false.
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

/**
 * Checks if the value is a boolean.
 * @param value - The value to check.
 * @returns true if the value is a boolean, otherwise false.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean' || value instanceof Boolean;
}

/**
 * Checks if the value is a symbol.
 * @param value - The value to check.
 * @returns true if the value is a symbol, otherwise false.
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

/**
 * Checks if the value is a date.
 * @param value - The value to check.
 * @returns true if the value is a date, otherwise false.
 */
export function isDate(value: unknown): value is Date {
  return getType(value) === 'date';
}

/**
 * Checks if the value is an array.
 * @param value - The value to check.
 * @returns true if the value is an array, otherwise false.
 */
export function isArray<T>(value: unknown): value is Array<T> {
  return Array.isArray(value);
}

/**
 * Checks if the value is an object.
 * @param value - The value to check.
 * @returns true if the value is an object, otherwise false.
 */
export function isObject(value: unknown): value is object {
  return getType(value) === 'object';
}

/**
 * Checks if the value is null.
 * @param value - The value to check.
 * @returns true if the value is null, otherwise false.
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Checks if the value is undefined.
 * @param value - The value to check.
 * @returns true if the value is undefined, otherwise false.
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Checks if the value is null or undefined.
 * @param value - The value to check.
 * @returns true if the value is null or undefined, otherwise false.
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Checks if the value is of an allowed type.
 * @param value - The value to check.
 * @param allowed - An array of allowed types.
 * @returns true if the value is of an allowed type, otherwise false.
 */
export function isAllowedType(value: unknown, allowed: TValueType[]): boolean {
  return allowed.includes(getType(value));
}
