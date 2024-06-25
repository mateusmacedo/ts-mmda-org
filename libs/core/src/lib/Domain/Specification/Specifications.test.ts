import { AndSpecification, NotSpecification, OrSpecification } from './Specifications';
describe('Specifications', () => {
  describe('AndSpecification', () => {
    it('should return true if all specifications are satisfied', () => {
      const spec1 = {
        isSatisfiedBy: jest.fn().mockReturnValue(true),
      } as unknown as AndSpecification<unknown>;
      const spec2 = {
        isSatisfiedBy: jest.fn().mockReturnValue(true),
      } as unknown as AndSpecification<unknown>;
      const andSpec = new AndSpecification(spec1, spec2);
      const candidate = {};

      const result = andSpec.isSatisfiedBy(candidate);

      expect(result).toBe(true);
      expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
      expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    });

    it('should return false if any specification is not satisfied', () => {
      const spec1 = {
        isSatisfiedBy: jest.fn().mockReturnValue(true),
      } as unknown as AndSpecification<unknown>;
      const spec2 = {
        isSatisfiedBy: jest.fn().mockReturnValue(false),
      } as unknown as AndSpecification<unknown>;
      const andSpec = new AndSpecification(spec1, spec2);
      const candidate = {};

      const result = andSpec.isSatisfiedBy(candidate);

      expect(result).toBe(false);
      expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
      expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    });

    it('should return true with multiples specifications', () => {
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

      const result = andSpec.isSatisfiedBy(candidate);

      expect(result).toBe(true);
      expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
      expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
      expect(spec3.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    });
  });

  describe('OrSpecification', () => {
    it('should return true if any of the specifications is satisfied', () => {
      const spec1 = {
        isSatisfiedBy: jest.fn().mockReturnValue(false),
      } as unknown as OrSpecification<unknown>;
      const spec2 = {
        isSatisfiedBy: jest.fn().mockReturnValue(false),
      } as unknown as OrSpecification<unknown>;
      const spec3 = {
        isSatisfiedBy: jest.fn().mockReturnValue(true),
      } as unknown as OrSpecification<unknown>;
      const orSpec = new OrSpecification(spec1, spec2, spec3);
      const candidate = {};

      const result = orSpec.isSatisfiedBy(candidate);

      expect(result).toBe(true);
      expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
      expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
      expect(spec3.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    });

    it('should return false if none of the specifications is satisfied', () => {
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

      const result = orSpec.isSatisfiedBy(candidate);

      expect(result).toBe(false);
      expect(spec1.isSatisfiedBy).toHaveBeenCalledWith(candidate);
      expect(spec2.isSatisfiedBy).toHaveBeenCalledWith(candidate);
      expect(spec3.isSatisfiedBy).toHaveBeenCalledWith(candidate);
    });
  });

  describe('NotSpecification', () => {
    it('should return true when the inner specification returns false', () => {
      const innerSpec = {
        isSatisfiedBy: jest.fn().mockReturnValue(false),
      } as unknown as NotSpecification<unknown>;
      const notSpec = new NotSpecification(innerSpec);

      const result = notSpec.isSatisfiedBy({});

      expect(result).toBe(true);
      expect(innerSpec.isSatisfiedBy).toHaveBeenCalledTimes(1);
    });

    it('should return false when the inner specification returns true', () => {
      const innerSpec = {
        isSatisfiedBy: jest.fn().mockReturnValue(true),
      } as unknown as NotSpecification<unknown>;
      const notSpec = new NotSpecification(innerSpec);

      const result = notSpec.isSatisfiedBy({});

      expect(result).toBe(false);
      expect(innerSpec.isSatisfiedBy).toHaveBeenCalledTimes(1);
    });

    it('should return true when the inner specification is negated with false', () => {
      const innerSpec = {
        isSatisfiedBy: jest.fn().mockReturnValue(false),
      } as unknown as NotSpecification<unknown>;
      const notSpec = new NotSpecification(innerSpec);

      const result = notSpec.isSatisfiedBy({});

      expect(result).toBe(true);
      expect(innerSpec.isSatisfiedBy).toHaveBeenCalledTimes(1);
    });
  });
});
