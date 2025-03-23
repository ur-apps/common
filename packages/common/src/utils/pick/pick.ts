/**
 * Creates a new object with only the specified keys from the original object.
 *
 * @template T - The type of the source object
 * @template K - The literal type of allowed keys to pick from T
 * @param {T} obj - The source object to pick properties from
 * @param {K[]} keys - Array of keys to select from the source object
 * @returns {Pick<T, K>} A new object containing only the specified keys from the original
 *
 * @example
 * const user = { id: 1, name: 'John', age: 30, email: 'john@example.com' };
 * const userBasicInfo = pick(user, ['id', 'name']);
 * // Result: { id: 1, name: 'John' }
 */
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const picked: Partial<Pick<T, K>> = {};

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      picked[key] = obj[key];
    }
  });

  return picked as Pick<T, K>;
}
