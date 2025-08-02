import { get } from './get';

describe('[utils] get', () => {
  const testObject = {
    user: {
      name: 'John',
      age: 30,
      profile: {
        bio: 'Software developer',
        social: {
          twitter: '@john',
          github: 'johndoe',
        },
      },
      hobbies: ['coding', 'reading', 'gaming'],
    },
    config: {
      theme: 'dark',
      notifications: true,
    },
    nullValue: null,
    emptyString: '',
    zeroValue: 0,
    falseValue: false,
  };

  describe('valid object paths', () => {
    it('should return value for simple string path', () => {
      expect(get(testObject, 'user.name', 'default')).toBe('John');
      expect(get(testObject, 'config.theme', 'default')).toBe('dark');
    });

    it('should return value for array path', () => {
      expect(get(testObject, ['user', 'name'], 'default')).toBe('John');
      expect(get(testObject, ['user', 'profile', 'bio'], 'default')).toBe('Software developer');
    });

    it('should return value for nested paths', () => {
      expect(get(testObject, 'user.profile.social.twitter', 'default')).toBe('@john');
      expect(get(testObject, ['user', 'profile', 'social', 'github'], 'default')).toBe('johndoe');
    });

    it('should return array elements', () => {
      expect(get(testObject, 'user.hobbies.0', 'default')).toBe('coding');
      expect(get(testObject, ['user', 'hobbies', '1'], 'default')).toBe('reading');
    });

    it('should return falsy values correctly', () => {
      expect(get(testObject, 'nullValue', 'default')).toBe(null);
      expect(get(testObject, 'emptyString', 'default')).toBe('');
      expect(get(testObject, 'zeroValue', 'default')).toBe(0);
      expect(get(testObject, 'falseValue', 'default')).toBe(false);
    });
  });

  describe('invalid paths', () => {
    it('should return default value for non-existent paths', () => {
      expect(get(testObject, 'user.nonexistent', 'default')).toBe('default');
      expect(get(testObject, 'nonexistent.path', 'default')).toBe('default');
      expect(get(testObject, ['user', 'nonexistent'], 'default')).toBe('default');
    });

    it('should return default value for paths through null/undefined', () => {
      expect(get(testObject, 'nullValue.property', 'default')).toBe('default');
      expect(get(testObject, 'user.undefinedProp.nested', 'default')).toBe('default');
    });

    it('should return default value for out-of-bounds array access', () => {
      expect(get(testObject, 'user.hobbies.10', 'default')).toBe('default');
      expect(get(testObject, ['user', 'hobbies', '100'], 'default')).toBe('default');
    });
  });

  describe('edge cases', () => {
    it('should return default value for non-object inputs', () => {
      // @ts-expect-error forcing type error to test behavior
      expect(get(null, 'path', 'default')).toBe('default');
      // @ts-expect-error forcing type error to test behavior
      expect(get(undefined, 'path', 'default')).toBe('default');
      // @ts-expect-error forcing type error to test behavior
      expect(get('string', 'path', 'default')).toBe('default');
      // @ts-expect-error forcing type error to test behavior
      expect(get(123, 'path', 'default')).toBe('default');
      // @ts-expect-error forcing type error to test behavior
      expect(get(true, 'path', 'default')).toBe('default');
    });

    it('should handle empty paths', () => {
      expect(get(testObject, '', 'default')).toBe(testObject);
      expect(get(testObject, [], 'default')).toBe(testObject);
      expect(get(testObject, [''], 'default')).toBe(testObject);
    });

    it('should handle single key paths', () => {
      expect(get(testObject, 'user', 'default')).toBe(testObject.user);
      expect(get(testObject, ['config'], 'default')).toBe(testObject.config);
    });

    it('should handle different default value types', () => {
      expect(get(testObject, 'nonexistent', null)).toBe(null);
      expect(get(testObject, 'nonexistent', undefined)).toBe(undefined);
      expect(get(testObject, 'nonexistent', 0)).toBe(0);
      expect(get(testObject, 'nonexistent', false)).toBe(false);
      expect(get(testObject, 'nonexistent', [])).toEqual([]);
      expect(get(testObject, 'nonexistent', {})).toEqual({});
    });

    it('should handle paths with dots in keys when using array notation', () => {
      const objWithDots = {
        'key.with.dots': 'value',
        nested: {
          'another.key.with.dots': 'nested value',
        },
      };

      expect(get(objWithDots, ['key.with.dots'], 'default')).toBe('value');
      expect(get(objWithDots, ['nested', 'another.key.with.dots'], 'default')).toBe('nested value');
    });
  });

  describe('performance and complex objects', () => {
    it('should handle deeply nested objects', () => {
      const deepObject = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  value: 'deep value',
                },
              },
            },
          },
        },
      };

      expect(get(deepObject, 'level1.level2.level3.level4.level5.value', 'default')).toBe('deep value');
      expect(get(deepObject, ['level1', 'level2', 'level3', 'level4', 'level5', 'value'], 'default')).toBe(
        'deep value'
      );
    });

    it('should handle objects with numeric keys', () => {
      const objWithNumbers = {
        123: 'numeric key',
        nested: {
          456: 'nested numeric key',
        },
      };

      expect(get(objWithNumbers, '123', 'default')).toBe('numeric key');
      expect(get(objWithNumbers, 'nested.456', 'default')).toBe('nested numeric key');
    });
  });
});
