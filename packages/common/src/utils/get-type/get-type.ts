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
 * Checks if the value is of an allowed type.
 * @param value - The value to check.
 * @param allowed - An array of allowed types.
 * @returns true if the value is of an allowed type, otherwise false.
 */
export function isAllowedType(value: unknown, allowed: TValueType[]): boolean {
  return allowed.includes(getType(value));
}
