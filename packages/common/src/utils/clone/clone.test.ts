import { clone } from './clone';

describe('clone function', () => {
  it('should clone primitive types without modification', () => {
    // Arrange
    const numberValue = 42;
    const stringValue = 'Hello, world!';
    const booleanValue = true;

    // Act
    const clonedNumber = clone(numberValue);
    const clonedString = clone(stringValue);
    const clonedBoolean = clone(booleanValue);

    // Assert
    expect(clonedNumber).toBe(numberValue);
    expect(clonedString).toBe(stringValue);
    expect(clonedBoolean).toBe(booleanValue);
  });

  it('should clone arrays correctly', () => {
    // Arrange
    const originalArray = [1, 'two', { key: 'value' }];

    // Act
    const clonedArray = clone(originalArray);

    // Assert
    expect(clonedArray).toEqual(originalArray);
    expect(clonedArray).not.toBe(originalArray); // Check for reference equality
    expect(clonedArray[2]).not.toBe(originalArray[2]); // Check for reference equality
  });

  it('should clone objects correctly', () => {
    // Arrange
    const originalObject = {
      key1: 'value1',
      key2: [1, 2, 3],
      key3: { nestedKey: 'nestedValue' },
    };

    // Act
    const clonedObject = clone(originalObject);

    // Assert
    expect(clonedObject).toEqual(originalObject);
    expect(clonedObject).not.toBe(originalObject); // Check for reference equality
    expect(clonedObject.key2).not.toBe(originalObject.key2); // Check for reference equality
    expect(clonedObject.key3).not.toBe(originalObject.key3); // Check for reference equality
  });

  it('should handle cloning of objects with functions', () => {
    // Arrange
    const originalObject = {
      key: 'value',
      func: function () {
        console.info('Original function');
      },
    };

    // Act
    const clonedObject = clone(originalObject);

    // Assert
    expect(clonedObject).toEqual(originalObject);
    expect(clonedObject.func).toBe(originalObject.func); // Functions should be copied by reference
  });

  it('should handle cloning of objects with circular references', () => {
    // Arrange
    const circularObject: Record<string, unknown> = { prop: 'value' };
    circularObject.circularReference = circularObject;

    // Act
    const clonedCircularObject = clone(circularObject);

    // Assert
    expect(clonedCircularObject).toEqual(circularObject);
    expect(clonedCircularObject.circularReference).toBe(clonedCircularObject); // Circular reference should be maintained
  });

  it('should handle cloning of objects with specific types', () => {
    // Arrange
    class CustomType {
      constructor(public prop: string) {}
    }

    const originalObject = {
      customTypeInstance: new CustomType('customValue'),
    };

    // Act
    const clonedObject = clone(originalObject);

    // Assert
    expect(clonedObject).toEqual(originalObject);
  });
});
