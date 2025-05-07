import { ValidationError } from 'class-validator';

import { Errors } from 'interfaces';

export function mapClassValidatorErrors(errors: ValidationError[]): Errors {
  return errors.reduce<Errors>((prev, current) => {
    const { property, constraints, children } = current;

    if (property) {
      if (constraints) {
        const issues = Object.values(constraints);

        prev[property] = issues.length === 1 ? issues[0] : issues;
      } else if (children?.length) {
        prev[property] = mapClassValidatorErrors(children);
      }
    }

    return prev;
  }, {});
}
