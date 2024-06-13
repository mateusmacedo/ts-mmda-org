import { ArrayValidator } from './ArrayValidator';
import { IValidator, Path } from './IValidator';
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

describe('ArrayValidator', () => {
  const mockValidator = new MockValidator();
  const arrayValidator = new ArrayValidator(mockValidator);

  it('should validate an array of valid items without path', () => {
    const result = arrayValidator.validate(['valid', 'valid']);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return errors for an array with invalid items without path', () => {
    const result = arrayValidator.validate(['valid', 'invalid']);
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('Invalid item');
  });

  it('should validate an array of valid items with path', () => {
    const result = arrayValidator.validate(['valid', 'valid'], 'root');
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return errors for an array with invalid items with path', () => {
    const result = arrayValidator.validate(['valid', 'invalid'], 'root');
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('Invalid item');
    expect(result.errors[0].path).toBe('root[1]');
  });

  it('should return an error if the input is not an array', () => {
    const result = arrayValidator.validate('not an array' as unknown as unknown[]);
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('Expected an array');
  });
});
