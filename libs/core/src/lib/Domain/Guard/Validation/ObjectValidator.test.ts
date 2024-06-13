import { IValidator, Path } from './IValidator';
import { ObjectValidator } from './ObjectValidator';
import { ValidationError } from './ValidationError';
import { ValidationResult } from './ValidationResult';

class MockValidator implements IValidator<unknown> {
  validate(input: unknown, path: Path = ''): ValidationResult {
    if (input === 'valid') {
      return { success: true, errors: [] };
    } else {
      return { success: false, errors: [new ValidationError(path.toString(), 'Invalid item')] };
    }
  }
}

describe('ObjectValidator', () => {
  const mockValidator = new MockValidator();
  const objectValidator = new ObjectValidator<{ key1: unknown; key2: unknown }>({
    key1: mockValidator,
    key2: mockValidator,
  });

  it('should validate an object with valid properties', () => {
    const result = objectValidator.validate({ key1: 'valid', key2: 'valid' });
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return errors for an object with invalid properties', () => {
    const result = objectValidator.validate({ key1: 'valid', key2: 'invalid' });
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('Invalid item');
  });

  it('should return an error if the input is not an object', () => {
    const result = objectValidator.validate(
      'not an object' as unknown as { key1: unknown; key2: unknown },
    );
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('Expected an object');
  });

  it('should validate an object with valid properties and a path', () => {
    const result = objectValidator.validate({ key1: 'valid', key2: 'valid' }, 'root');
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return errors for an object with invalid properties and a path', () => {
    const result = objectValidator.validate({ key1: 'valid', key2: 'invalid' }, 'root');
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('Invalid item');
    expect(result.errors[0].path).toBe('root.key2');
  });

  it('should handle missing keys gracefully', () => {
    const result = objectValidator.validate({ key1: 'valid' } as unknown, 'root');
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle extra keys gracefully', () => {
    const result = objectValidator.validate(
      { key1: 'valid', key2: 'valid', key3: 'extra' } as unknown,
      'root',
    );
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
