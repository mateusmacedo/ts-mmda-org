import { InstanceCreationError, InvalidPropsError, TargetConstructorError } from './FactoryErrors';
import { BasicFactory, Factory } from './InstanceFactory';

class ExampleClass {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

describe('BasicFactory', () => {
  let factory: Factory;

  beforeEach(() => {
    factory = new BasicFactory();
  });

  // Happy Path Tests
  it('should create instance with target and props', () => {
    const instance = factory.create(ExampleClass, ['John Doe', 30]);
    expect(instance).toBeInstanceOf(ExampleClass);
    expect(instance.name).toBe('John Doe');
    expect(instance.age).toBe(30);
  });

  it('should create instance with target only', () => {
    class NoPropsClass {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      constructor() {}
    }

    const instance = factory.create(NoPropsClass);
    expect(instance).toBeInstanceOf(NoPropsClass);
  });

  it('should create instance with props only (default target)', () => {
    class DefaultClass {
      constructor(
        public name = 'default',
        public age = 0,
      ) {}
    }

    const instance = factory.create(DefaultClass, []);
    expect(instance).toBeInstanceOf(DefaultClass);
    expect(instance.name).toBe('default');
    expect(instance.age).toBe(0);
  });

  it('should create instance without target and props', () => {
    class NoArgsClass {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      constructor() {}
    }

    const instance = factory.create(NoArgsClass);
    expect(instance).toBeInstanceOf(NoArgsClass);
  });

  // Edge Case Tests
  it('should throw TargetConstructorError when no target constructor', () => {
    expect(() => {
      factory.create(null as unknown as new () => ExampleClass);
    }).toThrow(TargetConstructorError);
  });

  it('should throw InvalidPropsError when props is not an array', () => {
    expect(() => {
      factory.create(
        ExampleClass,
        'invalid props' as unknown as ConstructorParameters<typeof ExampleClass>,
      );
    }).toThrow(InvalidPropsError);
  });

  it('should throw InstanceCreationError when instance creation fails', () => {
    class ErrorClass {
      constructor() {
        throw new Error('Creation failed');
      }
    }

    expect(() => {
      factory.create(ErrorClass);
    }).toThrow(InstanceCreationError);
  });
});
