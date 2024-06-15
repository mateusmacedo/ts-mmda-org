import { NotSpecification } from './Specifications';

describe('NotSpecification', () => {
  it('should return true when the inner specification returns false', () => {
    // Arrange
    const innerSpec = {
      isSatisfiedBy: jest.fn().mockReturnValue(false),
    } as unknown as NotSpecification<unknown>;
    const notSpec = new NotSpecification(innerSpec);

    // Act
    const result = notSpec.isSatisfiedBy({});

    // Assert
    expect(result).toBe(true);
    expect(innerSpec.isSatisfiedBy).toHaveBeenCalledTimes(1);
  });

  it('should return false when the inner specification returns true', () => {
    // Arrange
    const innerSpec = {
      isSatisfiedBy: jest.fn().mockReturnValue(true),
    } as unknown as NotSpecification<unknown>;
    const notSpec = new NotSpecification(innerSpec);

    // Act
    const result = notSpec.isSatisfiedBy({});

    // Assert
    expect(result).toBe(false);
    expect(innerSpec.isSatisfiedBy).toHaveBeenCalledTimes(1);
  });

  it('should return true when the inner specification is negated with false', () => {
    // Arrange
    const innerSpec = {
      isSatisfiedBy: jest.fn().mockReturnValue(false),
    } as unknown as NotSpecification<unknown>;
    const notSpec = new NotSpecification(innerSpec);
    const finalSpec = notSpec.not();

    // Act
    const result = finalSpec.isSatisfiedBy({});

    // Assert
    expect(result).toBe(true);
    expect(innerSpec.isSatisfiedBy).toHaveBeenCalledTimes(1);
  });
});
