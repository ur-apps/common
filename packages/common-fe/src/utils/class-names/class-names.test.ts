import { classNames } from './class-names';

describe('classNames function', () => {
  it('string classes', () => {
    const result = classNames('class1', 'class2', 'class3');

    expect(result).toBe('class1 class2 class3');
  });

  it('string and nullable classes', () => {
    const result = classNames('class1', null, 'class3', undefined);

    expect(result).toBe('class1 class3');
  });

  it('array classes', () => {
    const result = classNames(['class1', null, 'class3', undefined]);

    expect(result).toBe('class1 class3');
  });

  it('object classes', () => {
    const result = classNames({ class1: false, class2: true, class3: true });

    expect(result).toBe('class2 class3');
  });

  it('combined classes', () => {
    const result = classNames(
      'class1',
      'class2',
      null,
      ['class3', undefined, 'class4'],
      { 'class5': false, class6: true },
      undefined
    );

    expect(result).toBe('class1 class2 class3 class4 class6');
  });
});
