import { isArray, isDate, isObject } from '../get-type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cloneObject<T extends Record<string, any>>(obj: T, clonedMap = new WeakMap<object, any>()): T {
  if (clonedMap.has(obj)) {
    return clonedMap.get(obj);
  }

  const newObject = {} as T;

  clonedMap.set(obj, newObject);

  for (const [key, value] of Object.entries(obj)) {
    newObject[key as keyof T] = clone(value, clonedMap);
  }

  return newObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cloneArray<T extends Array<unknown>>(arr: T, clonedMap = new WeakMap<object, any>()): T {
  if (clonedMap.has(arr)) {
    return clonedMap.get(arr);
  }

  const newArray = [] as unknown as T;

  clonedMap.set(arr, newArray);

  for (const value of arr) {
    newArray.push(clone(value, clonedMap));
  }

  return newArray;
}

export function cloneSet<T extends Set<unknown>>(value: T): T {
  const clonedSet = new Set() as T;

  for (const item of value) {
    clonedSet.add(clone(item));
  }

  return clonedSet;
}

export function cloneMap<T extends Map<unknown, unknown>>(value: T): T {
  const clonedMap = new Map() as T;

  for (const [key, val] of value) {
    clonedMap.set(clone(key), clone(val));
  }

  return clonedMap;
}

export function cloneDate<T extends Date>(value: T): T {
  return new Date(value.getTime()) as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clone<T>(value: T, clonedMap = new WeakMap<object, any>()): T {
  if (isArray(value)) {
    return cloneArray(value, clonedMap);
  } else if (isObject(value)) {
    return cloneObject(value, clonedMap);
  } else if (value instanceof Set) {
    return cloneSet(value);
  } else if (value instanceof Map) {
    return cloneMap(value);
  } else if (isDate(value)) {
    return cloneDate(value);
  }

  return value;
}
