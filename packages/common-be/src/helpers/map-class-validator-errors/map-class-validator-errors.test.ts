import { mapClassValidatorErrors } from '..';

import { classValidatorErrors, mappedErrors } from './map-class-validator-errors.test.data';

describe('Testing hellper: mapClassValidatorErrors', () => {
  it('should correctly map dataset 1', () => {
    const result = mapClassValidatorErrors(classValidatorErrors[1]);

    expect(result).toEqual(mappedErrors[1]);
  });

  it('should correctly map dataset 2', () => {
    const result = mapClassValidatorErrors(classValidatorErrors[2]);

    expect(result).toEqual(mappedErrors[2]);
  });
});
