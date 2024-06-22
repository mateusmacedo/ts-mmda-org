import { ValidationError } from './ValidationError';

export type ValidationResult = {
  success: boolean;
  errors: ValidationError[];
};
