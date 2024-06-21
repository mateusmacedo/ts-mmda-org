import { BaseValueObject } from './ValueObject';

class TestValueObject extends BaseValueObject<{
  id?: number;
  name?: string | null;
  values?: number[];
  obj?: Record<string, unknown>;
  num?: number;
}> {}

class AnotherTestValueObject extends BaseValueObject<{
  id?: number;
  name?: string | null;
  values?: number[];
  obj?: Record<string, unknown>;
  num?: number;
}> {}

describe('BaseValueObject', () => {
  it('should create an instance with valid props and check if equals method returns true for same instance', () => {
    const vo = new TestValueObject({ id: 1, name: 'Test' });
    expect(vo.equals(vo)).toBeTruthy();
  });

  it('should return true when comparing two instances with the same props', () => {
    const vo1 = new TestValueObject({ id: 1, name: 'Test' });
    const vo2 = new TestValueObject({ id: 1, name: 'Test' });
    expect(vo1.equals(vo2)).toBeTruthy();
  });

  it('should return false when comparing two instances with different props', () => {
    const vo1 = new TestValueObject({ id: 1 });
    const vo2 = new TestValueObject({ id: 2 });
    expect(vo1.equals(vo2)).toBeFalsy();
  });

  it('should return false when comparing instances of different classes', () => {
    const vo1 = new TestValueObject({ id: 1, name: 'Test' });
    const vo2 = new AnotherTestValueObject({ id: 1, name: 'Test' });
    expect(vo1.equals(vo2)).toBeFalsy();
  });

  it('should return a string representation of the props', () => {
    const vo = new TestValueObject({ id: 1, name: 'Test' });
    expect(vo.toString()).toEqual(JSON.stringify({ id: 1, name: 'Test' }));
  });

  it('should return the props when calling toValue', () => {
    const props = { id: 1, name: 'Test' };
    const vo = new TestValueObject(props);
    expect(vo.toValue()).toEqual(props);
  });

  it('should handle undefined props correctly', () => {
    const vo1 = new TestValueObject(undefined);
    const vo2 = new TestValueObject({ id: 1 });
    expect(vo1.equals(vo2)).toBeFalsy();
    expect(vo1.toValue()).toEqual({});
  });

  it('should handle an empty props object', () => {
    const vo = new TestValueObject({});
    expect(vo.toValue()).toEqual({});
  });

  it('should handle props object with undefined values', () => {
    const vo = new TestValueObject({ id: undefined, name: undefined });
    expect(vo.toValue()).toEqual({ id: undefined, name: undefined });
  });

  it('should handle props object with null values', () => {
    const vo = new TestValueObject({ name: null });
    expect(vo.toValue()).toEqual({ name: null });
  });

  it('should handle props object with empty string values', () => {
    const vo = new TestValueObject({ name: '' });
    expect(vo.toValue()).toEqual({ name: '' });
  });

  it('should handle props object with empty array values', () => {
    const vo = new TestValueObject({ values: [] });
    expect(vo.toValue()).toEqual({ values: [] });
  });

  it('should handle props object with empty object values', () => {
    const vo = new TestValueObject({ obj: {} });
    expect(vo.toValue()).toEqual({ obj: {} });
  });

  it('should handle props object with NaN values', () => {
    const vo = new TestValueObject({ num: NaN });
    expect(vo.equals(new TestValueObject({ num: NaN }))).toBeFalsy(); // NaN is not equal to NaN
  });

  it('should handle props object with Infinity values', () => {
    const vo = new TestValueObject({ num: Infinity });
    expect(vo.toValue()).toEqual({ num: Infinity });
  });

  it('should handle props object with negative number values', () => {
    const vo = new TestValueObject({ num: -1 });
    expect(vo.toValue()).toEqual({ num: -1 });
  });

  it('should handle props object with zero values', () => {
    const vo = new TestValueObject({ num: 0 });
    expect(vo.toValue()).toEqual({ num: 0 });
  });

  it('should handle props object with different key values', () => {
    const vo1 = new TestValueObject({ id: 1 });
    const vo2 = new TestValueObject({ id: 2 });
    expect(vo1.equals(vo2)).toBeFalsy();
  });
});
