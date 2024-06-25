import { ValidationError } from './ValidationErrors';
export type TPath = string | number;

export type ValidationResult = {
  success: boolean;
  errors: ValidationError[];
};

export interface IValidator<T = unknown> {
  validate(input: T, path?: TPath): ValidationResult;
}

export function buildPath(base: string, key: TPath): string {
  if (base === '') {
    return key.toString();
  }
  if (typeof key === 'number') {
    return `${base}[${key}]`;
  }
  return `${base}.${key}`;
}

export class ArrayValidator implements IValidator<unknown> {
  constructor(private rule: IValidator<unknown>) {}

  validate(input: unknown, path: TPath = ''): ValidationResult {
    if (!Array.isArray(input)) {
      return {
        success: false,
        errors: [new ValidationError(path.toString(), 'Expected an array')],
      };
    }
    const result: ValidationResult = { success: true, errors: [] };
    input.forEach((item, index) => {
      const validation = this.rule.validate(item, path ? buildPath(path.toString(), index) : index);
      if (!validation.success) {
        result.success = false;
        result.errors = result.errors.concat(validation.errors);
      }
    });
    return result;
  }
}

export class ObjectValidator<T extends { [key: string]: unknown }> implements IValidator<T> {
  constructor(private rules: { [K in keyof T]: IValidator<T[K]> }) {}

  validate(input: unknown, path: TPath = ''): ValidationResult {
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
