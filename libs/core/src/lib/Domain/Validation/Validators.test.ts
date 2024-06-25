import { ValidationError } from './ValidationErrors';
import {
  ArrayValidator,
  IValidator,
  ObjectValidator,
  TPath,
  ValidationResult,
  buildPath,
} from './Validators';

class MockValidator implements IValidator<unknown> {
  validate(input: unknown, path: TPath = ''): ValidationResult {
    if (input === 'valid') {
      return { success: true, errors: [] };
    } else {
      return { success: false, errors: [new ValidationError(path.toString(), 'Invalid item')] };
    }
  }
}

describe('Validators', () => {
  describe('buildPath', () => {
    it('should return the key as path if base is empty', () => {
      expect(buildPath('', 'key')).toBe('key');
      expect(buildPath('', 0)).toBe('0');
    });

    it('should return path with dot notation if key is a string', () => {
      expect(buildPath('base', 'key')).toBe('base.key');
    });

    it('should return path with bracket notation if key is a number', () => {
      expect(buildPath('base', 0)).toBe('base[0]');
    });
  });

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
});
