import { isNullish, isObject } from '../get-type';

/**
 * Safely gets a nested property value from an object using a path.
 *
 * @template T - The type of the default value and return type
 * @param object - The object to get the value from
 * @param path - The path to the property (string with dots or array of keys)
 * @param defaultValue - The value to return if the path doesn't exist
 * @returns The value at the specified path or the default value
 *
 * @example
 * ```typescript
 * const obj = { user: { name: 'John', age: 30 } };
 * get(obj, 'user.name', 'Unknown'); // 'John'
 * get(obj, ['user', 'name'], 'Unknown'); // 'John'
 * get(obj, 'user.email', 'No email'); // 'No email'
 * ```
 */
export function get<T, O extends Record<string, unknown> = Record<string, unknown>>(
  object: O,
  path: string | string[],
  defaultValue?: T
) {
  if (!isObject(object)) {
    return defaultValue;
  }

  if (isNullish(path) || path.length === 0) {
    return object;
  }

  let result: unknown = object;
  const keys = Array.isArray(path) ? path : path.split('.');

  if (keys.length === 1 && keys[0] === '') {
    return object;
  }

  for (const key of keys) {
    if (isNullish(result) || !(key in (result as object))) {
      return defaultValue;
    }

    result = (result as Record<string, unknown>)[key];
  }

  return result as T;
}
