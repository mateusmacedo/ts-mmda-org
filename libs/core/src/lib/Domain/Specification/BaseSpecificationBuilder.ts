import { ISpecification } from './ISpecification';
import { SpecificationBuilder } from './ISpecificationBuilder';
import { SpecificationNotSetError } from './SpecificationErrors';
import { AndSpecification, NotSpecification, OrSpecification } from './Specifications';

export class BaseSpecificationBuilder<T> implements SpecificationBuilder<T> {
  private spec: ISpecification<T> | null = null;

  withSpecification(spec: ISpecification<T>): SpecificationBuilder<T> {
    this.spec = spec;
    return this;
  }

  and(...specs: ISpecification<T>[]): SpecificationBuilder<T> {
    if (this.spec === null) {
      throw new SpecificationNotSetError();
    }
    this.spec = new AndSpecification<T>(this.spec, ...specs);
    return this;
  }

  or(...specs: ISpecification<T>[]): SpecificationBuilder<T> {
    if (this.spec === null) {
      throw new SpecificationNotSetError();
    }
    this.spec = new OrSpecification<T>(this.spec, ...specs);
    return this;
  }

  not(): SpecificationBuilder<T> {
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
