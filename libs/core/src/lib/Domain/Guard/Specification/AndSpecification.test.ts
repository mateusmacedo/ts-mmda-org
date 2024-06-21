import { AndSpecification } from './Specifications';

describe('AndSpecification', () => {
  it('should return true if all specifications are satisfied', () => {
    // Arrange
    const spec1 = {
      isSatisfiedBy: jest.fn().mockReturnValue(true),
    } as unknown as AndSpecification<unknown>;
    const spec2 = {
      isSatisfiedBy: jest.fn().mockReturnValue(true),
    } as unknown as AndSpecification<unknown>;
    const andSpec = new AndSpecification(spec1, spec2);
    const candidate = {};

    // Act
    const result = andSpec.isSatisfiedBy(candidate);

    // Assert
    expect(result).toBe(true);
    expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
  });

  it('should return false if any specification is not satisfied', () => {
    // Arrange
    const spec1 = {
      isSatisfiedBy: jest.fn().mockReturnValue(true),
    } as unknown as AndSpecification<unknown>;
    const spec2 = {
      isSatisfiedBy: jest.fn().mockReturnValue(false),
    } as unknown as AndSpecification<unknown>;
    const andSpec = new AndSpecification(spec1, spec2);
    const candidate = {};

    // Act
    const result = andSpec.isSatisfiedBy(candidate);

    // Assert
    expect(result).toBe(false);
    expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
  });

  it('should return true with multiples specifications', () => {
    // Arrange
    const spec1 = {
      isSatisfiedBy: jest.fn().mockReturnValue(true),
    } as unknown as AndSpecification<unknown>;
    const spec2 = {
      isSatisfiedBy: jest.fn().mockReturnValue(true),
    } as unknown as AndSpecification<unknown>;
    const spec3 = {
      isSatisfiedBy: jest.fn().mockReturnValue(true),
    } as unknown as AndSpecification<unknown>;
    const andSpec = new AndSpecification(spec1, spec2, spec3);
    const candidate = {};

    // Act
    const result = andSpec.isSatisfiedBy(candidate);

    // Assert
    expect(result).toBe(true);
    expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    expect(spec3.isSatisfiedBy).toHaveBeenCalledWith(candidate);
  });
});
