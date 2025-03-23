import { isArray, isObject, isString } from '@ur-apps/common';

export type TClasses = Array<string | TClasses | Record<string, boolean> | null | undefined>;

export function classNames(...classes: TClasses): string {
  const result: string[] = [];

  classes.forEach((el) => {
    if (isArray(el)) {
      result.push(classNames(...el));
    } else if (isObject(el)) {
      Object.entries(el).forEach(([cn, condition]) => {
        if (condition) {
          result.push(cn);
        }
      });
    } else if (isString(el)) {
      result.push(el);
    }
  });

  return result.join(' ');
}
