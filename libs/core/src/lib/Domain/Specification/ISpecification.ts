export type Candidate<T> = T | T[];

export interface ISpecification<T> {
  isSatisfiedBy(candidate: Candidate<T>): boolean;
}
