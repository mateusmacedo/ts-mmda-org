import { ValidationResult } from './ValidationResult';

export type Path = string | number;

export interface IValidator<T = unknown> {
  validate(input: T, path?: Path): ValidationResult;
}
