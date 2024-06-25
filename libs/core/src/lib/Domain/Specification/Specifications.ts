export type TCandidate<T> = T | T[];

export interface ISpecification<T> {
  isSatisfiedBy(candidate: TCandidate<T>): boolean;
}

export abstract class Specification<T> implements ISpecification<T> {
  protected specs: ISpecification<T>[];
  abstract isSatisfiedBy(candidate: TCandidate<T>): boolean;
}

export class AndSpecification<T> extends Specification<T> {
  constructor(...specs: ISpecification<T>[]) {
    super();
    this.specs = specs;
  }

  isSatisfiedBy(candidate: TCandidate<T>): boolean {
    return this.specs.every((spec) => spec.isSatisfiedBy(candidate));
  }
}

export class OrSpecification<T> extends Specification<T> {
  constructor(...specs: ISpecification<T>[]) {
    super();
    this.specs = specs;
  }

  isSatisfiedBy(candidate: TCandidate<T>): boolean {
    return this.specs.some((spec) => spec.isSatisfiedBy(candidate));
  }
}

export class NotSpecification<T> extends Specification<T> {
  constructor(...specs: ISpecification<T>[]) {
    super();
    this.specs = specs;
  }

  isSatisfiedBy(candidate: TCandidate<T>): boolean {
    return !this.specs.some((spec) => spec.isSatisfiedBy(candidate));
  }
}
