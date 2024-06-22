import { ISpecification } from './ISpecification';

export interface SpecificationBuilder<T> {
  withSpecification(spec: ISpecification<T>): SpecificationBuilder<T>;
  and(...specs: ISpecification<T>[]): SpecificationBuilder<T>;
  or(...specs: ISpecification<T>[]): SpecificationBuilder<T>;
  not(): SpecificationBuilder<T>;
  build(): ISpecification<T>;
}
