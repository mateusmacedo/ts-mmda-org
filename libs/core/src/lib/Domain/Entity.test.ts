import { BaseEntity, TBaseEntityProps } from './Entity';

type TestID = string;

interface TestProps extends TBaseEntityProps<TestID> {
  additionalProp?: string;
}

class TestEntity extends BaseEntity<TestProps, TestID> {
  constructor(props: TestProps) {
    super(props);
  }

  public setAdditionalProp(value: string) {
    this.getProps().additionalProp = value;
  }

  public getAdditionalProp(): string | undefined {
    return this.getProps().additionalProp;
  }
}

describe('BaseEntity Tests', () => {
  const validProps: TestProps = {
    id: '123',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  it('should create a BaseEntity instance with valid props', () => {
    const entity = new TestEntity(validProps);
    expect(entity).toBeInstanceOf(TestEntity);
    expect(entity.getId()).toBe(validProps.id);
    expect(entity.getVersion()).toBe(validProps.version);
    expect(entity.getCreatedAt()).toEqual(validProps.createdAt);
    expect(entity.getUpdatedAt()).toEqual(validProps.updatedAt);
    expect(entity.getDeletedAt()).toBeNull();
    expect(entity.getProps()).toEqual(validProps);
  });

  it('should increment version of BaseEntity instance', () => {
    const entity = new TestEntity(validProps);
    entity.incrementVersion();
    expect(entity.getVersion()).toBe(validProps.version + 1);
    expect(entity.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should set deleted date of BaseEntity instance', () => {
    const entity = new TestEntity(validProps);
    const deletedDate = new Date();
    entity['setDeletedAt'](deletedDate);
    expect(entity.getDeletedAt()).toEqual(deletedDate);
  });

  // Edge Case Tests
  it('should throw error when creating BaseEntity with empty props', () => {
    expect(() => new TestEntity({} as TestProps)).toThrow('ID is required');
  });

  it('should create BaseEntity with all props', () => {
    const allProps: TestProps = { ...validProps, additionalProp: 'extra' };
    const entity = new TestEntity(allProps);
    expect(entity.getProps()).toEqual(allProps);
  });

  it('should throw error when creating BaseEntity with invalid ID', () => {
    const invalidProps: TestProps = { ...validProps, id: null as unknown as TestID };
    expect(() => new TestEntity(invalidProps)).toThrow('ID is required');
  });

  it('should throw error when creating BaseEntity with undefined ID', () => {
    const invalidProps: TestProps = { ...validProps, id: undefined as unknown as TestID };
    expect(() => new TestEntity(invalidProps)).toThrow('ID is required');
  });

  it('should throw error when creating BaseEntity with invalid version', () => {
    const invalidProps: TestProps = { ...validProps, version: 'invalid' as unknown as number };
    expect(() => new TestEntity(invalidProps)).toThrow('Version must be a number');
  });

  it('should throw error when creating BaseEntity with null version', () => {
    const invalidProps: TestProps = { ...validProps, version: null as unknown as number };
    expect(() => new TestEntity(invalidProps)).toThrow('Version must be a number');
  });

  it('should throw error when creating BaseEntity with invalid createdAt', () => {
    const invalidProps: TestProps = { ...validProps, createdAt: 'invalid date' as unknown as Date };
    expect(() => new TestEntity(invalidProps)).toThrow('CreatedAt must be a Date');
  });

  it('should throw error when creating BaseEntity with null createdAt', () => {
    const invalidProps: TestProps = { ...validProps, createdAt: null as unknown as Date };
    expect(() => new TestEntity(invalidProps)).toThrow('CreatedAt must be a Date');
  });

  it('should throw error when creating BaseEntity with invalid updatedAt', () => {
    const invalidProps: TestProps = { ...validProps, updatedAt: 'invalid date' as unknown as Date };
    expect(() => new TestEntity(invalidProps)).toThrow('UpdatedAt must be a Date');
  });

  it('should throw error when creating BaseEntity with null updatedAt', () => {
    const invalidProps: TestProps = { ...validProps, updatedAt: null as unknown as Date };
    expect(() => new TestEntity(invalidProps)).toThrow('UpdatedAt must be a Date');
  });

  it('should throw error when creating BaseEntity with invalid deletedAt', () => {
    const invalidProps: TestProps = { ...validProps, deletedAt: 'invalid date' as unknown as Date };
    expect(() => new TestEntity(invalidProps)).toThrow('DeletedAt must be a Date or null');
  });

  it('should not throw error when creating BaseEntity with undefined deletedAt', () => {
    const invalidProps: TestProps = { ...validProps, deletedAt: undefined };
    expect(() => new TestEntity(invalidProps)).not.toThrow();
  });

  it('should throw error when setting deleted date with invalid date', () => {
    const entity = new TestEntity(validProps);
    const invalidDate = 'invalid date' as unknown as Date;
    expect(() => entity['setDeletedAt'](invalidDate)).toThrow('DeletedAt must be a Date or null');
  });

  it('should not throw error when setting deleted date with null', () => {
    const entity = new TestEntity(validProps);
    expect(() => entity['setDeletedAt'](null)).not.toThrow();
  });

  it('should not throw error when setting deleted date with undefined', () => {
    const entity = new TestEntity(validProps);
    expect(() => entity['setDeletedAt'](undefined)).not.toThrow();
    expect(entity.getDeletedAt()).toBeNull();
  });

  // Testing default values
  it('should create BaseEntity with default version', () => {
    const propsWithoutVersion: TestProps = { ...validProps, version: undefined };
    delete propsWithoutVersion.version;
    const entity = new TestEntity(propsWithoutVersion);
    expect(entity.getVersion()).toBe(1); // Default version is 1
  });

  it('should create BaseEntity with default createdAt', () => {
    const propsWithoutCreatedAt: TestProps = { ...validProps, createdAt: undefined };
    delete propsWithoutCreatedAt.createdAt;
    const entity = new TestEntity(propsWithoutCreatedAt);
    expect(entity.getCreatedAt()).toBeInstanceOf(Date);
  });

  it('should create BaseEntity with default updatedAt', () => {
    const propsWithoutUpdatedAt: TestProps = { ...validProps, updatedAt: undefined };
    delete propsWithoutUpdatedAt.updatedAt;
    const entity = new TestEntity(propsWithoutUpdatedAt);
    expect(entity.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should create BaseEntity with default deletedAt', () => {
    const propsWithoutDeletedAt: TestProps = { ...validProps, deletedAt: undefined };
    delete propsWithoutDeletedAt.deletedAt;
    const entity = new TestEntity(propsWithoutDeletedAt);
    expect(entity.getDeletedAt()).toBeNull(); // Default deletedAt is null
  });

  it('should throw error when creating BaseEntity with invalid date object for deletedAt', () => {
    const invalidProps: TestProps = { ...validProps, deletedAt: new Date('invalid date') };
    expect(() => new TestEntity(invalidProps)).toThrow('DeletedAt must be a Date or null');
  });

  it('should throw error when setting deleted date with invalid date object', () => {
    const entity = new TestEntity(validProps);
    const invalidDate = new Date('invalid date');
    expect(() => entity['setDeletedAt'](invalidDate)).toThrow('DeletedAt must be a Date or null');
  });
});
