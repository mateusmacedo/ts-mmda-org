export type Candidate<T> = T | T[];

export interface ISpecification<T> {
  isSatisfiedBy(candidate: Candidate<T>): boolean;
  and(...specs: ISpecification<T>[]): ISpecification<T>;
  or(...specs: ISpecification<T>[]): ISpecification<T>;
  not(): ISpecification<T>;
}
