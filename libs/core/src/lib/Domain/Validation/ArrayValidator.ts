import { buildPath } from './Helpers';
import { IValidator, Path } from './IValidator';
import { ValidationError } from './ValidationError';
import { ValidationResult } from './ValidationResult';

export class ArrayValidator implements IValidator<unknown> {
  constructor(private rule: IValidator<unknown>) {}

  validate(input: unknown, path: Path = ''): ValidationResult {
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
