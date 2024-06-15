import { OrSpecification } from './Specifications';

describe('OrSpecification', () => {
  it('should return true if any of the specifications is satisfied', () => {
    // Arrange
    const spec1 = {
      isSatisfiedBy: jest.fn().mockReturnValue(false),
    } as unknown as OrSpecification<unknown>;
    const spec2 = {
      isSatisfiedBy: jest.fn().mockReturnValue(false),
    } as unknown as OrSpecification<unknown>;
    const spec3 = {
      isSatisfiedBy: jest.fn().mockReturnValue(true),
    } as unknown as OrSpecification<unknown>;
    const orSpec = new OrSpecification(spec1, spec2);
    const final = orSpec.or(spec3);
    const candidate = {};

    // Act
    const result = final.isSatisfiedBy(candidate);

    // Assert
    expect(result).toBe(true);
    expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    expect(spec3.isSatisfiedBy).toHaveBeenCalledWith(candidate);
  });

  it('should return false if none of the specifications is satisfied', () => {
    // Arrange
    const spec1 = {
      isSatisfiedBy: jest.fn().mockReturnValue(false),
    } as unknown as OrSpecification<unknown>;
    const spec2 = {
      isSatisfiedBy: jest.fn().mockReturnValue(false),
    } as unknown as OrSpecification<unknown>;
    const spec3 = {
      isSatisfiedBy: jest.fn().mockReturnValue(false),
    } as unknown as OrSpecification<unknown>;
    const orSpec = new OrSpecification(spec1, spec2, spec3);
    const candidate = {};

    // Act
    const result = orSpec.isSatisfiedBy(candidate);

    // Assert
    expect(result).toBe(false);
    expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    expect(spec3.isSatisfiedBy).toHaveBeenCalledWith(candidate);
  });
});
