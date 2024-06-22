import { BaseSpecificationBuilder } from './BaseSpecificationBuilder';
import { ISpecification } from './ISpecification';
import { SpecificationNotSetError } from './SpecificationNotSetError';

class DummyCandidate {}

describe('BaseSpecificationBuilder', () => {
  let builder: BaseSpecificationBuilder<DummyCandidate>;

  beforeEach(() => {
    builder = new BaseSpecificationBuilder<DummyCandidate>();
  });

  it('should create an instance of BaseSpecificationBuilder', () => {
    expect(builder).toBeInstanceOf(BaseSpecificationBuilder);
  });

  it('should set initial specification with withSpecification method', () => {
    const mockSpec: ISpecification<DummyCandidate> = {
      isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null,
    };
    builder.withSpecification(mockSpec);
    expect(() => builder.build()).not.toThrow();
  });

  it('should combine specifications with and method', () => {
    const mockSpec: ISpecification<DummyCandidate> = {
      isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null,
    };
    const anotherMockSpec: ISpecification<DummyCandidate> = {
      isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null,
    };
    const otherMockSpec: ISpecification<DummyCandidate> = {
      isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null,
    };
    builder.withSpecification(mockSpec).and(anotherMockSpec, otherMockSpec);
    expect(() => builder.build()).not.toThrow();
  });

  it('should combine specifications with or method', () => {
    const mockSpec: ISpecification<DummyCandidate> = {
      isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null,
    };
    const anotherMockSpec: ISpecification<DummyCandidate> = {
      isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null,
    };
    const otherMockSpec: ISpecification<DummyCandidate> = {
      isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null,
    };
    builder.withSpecification(mockSpec).or(anotherMockSpec, otherMockSpec);
    expect(() => builder.build()).not.toThrow();
  });

  it('should negate the specification with not method', () => {
    const mockSpec: ISpecification<DummyCandidate> = {
      isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null,
    };
    builder.withSpecification(mockSpec).not();
    expect(() => builder.build()).not.toThrow();
  });

  it('should return the specification with build method', () => {
    const mockSpec: ISpecification<DummyCandidate> = {
      isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null,
    };
    builder.withSpecification(mockSpec);
    expect(builder.build()).toBe(mockSpec);
  });

  it('should throw SpecificationNotSetError when build without setting specification', () => {
    expect(() => builder.build()).toThrow(SpecificationNotSetError);
  });

  it('should throw SpecificationNotSetError when calling and without setting specification', () => {
    expect(() =>
      builder.and({ isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null }),
    ).toThrow(SpecificationNotSetError);
  });

  it('should throw SpecificationNotSetError when calling or without setting specification', () => {
    expect(() =>
      builder.or({ isSatisfiedBy: (candidate: DummyCandidate) => candidate !== null }),
    ).toThrow(SpecificationNotSetError);
  });

  it('should throw SpecificationNotSetError when calling not without setting specification', () => {
    expect(() => builder.not()).toThrow(SpecificationNotSetError);
  });
});
