import { Candidate, ISpecification } from './ISpecification';

export abstract class BaseSpecification<T> implements ISpecification<T> {
  protected specs: ISpecification<T>[];

  abstract isSatisfiedBy(candidate: Candidate<T>): boolean;

  or(...specs: ISpecification<T>[]): ISpecification<T> {
    return new OrSpecification<T>(this, ...specs);
  }

  not(): ISpecification<T> {
    return new NotSpecification<T>(...this.specs);
  }

  and(...specs: ISpecification<T>[]): ISpecification<T> {
    return new AndSpecification<T>(this, ...specs);
  }
}

export class AndSpecification<T> extends BaseSpecification<T> {
  constructor(...specs: ISpecification<T>[]) {
    super();
    this.specs = specs;
  }

  isSatisfiedBy(candidate: Candidate<T>): boolean {
    return this.specs.every((spec) => spec.isSatisfiedBy(candidate));
  }
}

export class OrSpecification<T> extends BaseSpecification<T> {
  constructor(...specs: ISpecification<T>[]) {
    super();
    this.specs = specs;
  }

  isSatisfiedBy(candidate: Candidate<T>): boolean {
    return this.specs.some((spec) => spec.isSatisfiedBy(candidate));
  }
}

export class NotSpecification<T> extends BaseSpecification<T> {
  constructor(...specs: ISpecification<T>[]) {
    super();
    this.specs = specs;
  }

  isSatisfiedBy(candidate: Candidate<T>): boolean {
    return !this.specs.some((spec) => spec.isSatisfiedBy(candidate));
  }
}
