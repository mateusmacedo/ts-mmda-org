import { SpecificationNotSetError } from './SpecificationErrors';
import {
  AndSpecification,
  ISpecification,
  NotSpecification,
  OrSpecification,
} from './Specifications';

export interface ISpecificationBuilder<T> {
  withSpecification(spec: ISpecification<T>): ISpecificationBuilder<T>;
  and(...specs: ISpecification<T>[]): ISpecificationBuilder<T>;
  or(...specs: ISpecification<T>[]): ISpecificationBuilder<T>;
  not(): ISpecificationBuilder<T>;
  build(): ISpecification<T>;
}

export class SpecificationBuilder<T> implements ISpecificationBuilder<T> {
  private spec: ISpecification<T> | null = null;

  withSpecification(spec: ISpecification<T>): ISpecificationBuilder<T> {
    this.spec = spec;
    return this;
  }

  and(...specs: ISpecification<T>[]): ISpecificationBuilder<T> {
    if (this.spec === null) {
      throw new SpecificationNotSetError();
    }
    this.spec = new AndSpecification<T>(this.spec, ...specs);
    return this;
  }

  or(...specs: ISpecification<T>[]): ISpecificationBuilder<T> {
    if (this.spec === null) {
      throw new SpecificationNotSetError();
    }
    this.spec = new OrSpecification<T>(this.spec, ...specs);
    return this;
  }

  not(): ISpecificationBuilder<T> {
    if (this.spec === null) {
      throw new SpecificationNotSetError();
    }
    this.spec = new NotSpecification<T>(this.spec);
    return this;
  }

  build(): ISpecification<T> {
    if (this.spec === null) {
      throw new SpecificationNotSetError();
    }
    return this.spec;
  }
}
