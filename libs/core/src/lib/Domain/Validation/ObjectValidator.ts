import { buildPath } from './Helpers';
import { IValidator, Path } from './IValidator';
import { ValidationError } from './ValidationError';
import { ValidationResult } from './ValidationResult';

export class ObjectValidator<T extends { [key: string]: unknown }> implements IValidator<T> {
  constructor(private rules: { [K in keyof T]: IValidator<T[K]> }) {}

  validate(input: unknown, path: Path = ''): ValidationResult {
    if (typeof input !== 'object' || Array.isArray(input) || input === null) {
      return {
        success: false,
        errors: [new ValidationError(path.toString(), 'Expected an object')],
      };
    }
    const result: ValidationResult = { success: true, errors: [] };
    for (const key in this.rules) {
      if (Object.prototype.hasOwnProperty.call(this.rules, key)) {
        const rule = this.rules[key];
        const value = (input as T)[key];
        if (value !== undefined) {
          const validation = rule.validate(value, path ? buildPath(path.toString(), key) : key);
          if (!validation.success) {
            result.success = false;
            result.errors = result.errors.concat(validation.errors);
          }
        }
      }
    }
    return result;
  }
}
