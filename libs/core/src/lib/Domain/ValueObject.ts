export type ValueObjectProps<T> = {
  [Property in keyof T]?: T[Property];
};

export interface ValueObject<T extends ValueObjectProps<T>> {
  equals(value: ValueObject<T>): boolean;
  toString(): string;
  toValue(): ValueObjectProps<T>;
}

export abstract class BaseValueObject<T extends ValueObjectProps<T>> implements ValueObject<T> {
  protected readonly props: T;

  constructor(props?: T) {
    this.props = Object.freeze(props || ({} as T)); // Ensure immutability and handle undefined props
  }

  public equals(vo: ValueObject<T>): boolean {
    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }
    return this.compareProps(this.props, vo.toValue());
  }

  private compareProps(props1: ValueObjectProps<T>, props2: ValueObjectProps<T>): boolean {
    const keys1 = Object.keys(props1) as Array<keyof T>;
    const keys2 = Object.keys(props2) as Array<keyof T>;

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = props1[key];
      const val2 = props2[key];

      const areObjects = this.isObject(val1) && this.isObject(val2);
      if (
        (areObjects &&
          !this.compareProps(val1 as ValueObjectProps<T>, val2 as ValueObjectProps<T>)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  }

  private isObject(obj: unknown): boolean {
    return obj !== null && typeof obj === 'object';
  }

  public toString(): string {
    return JSON.stringify(this.props);
  }

  public toValue(): T {
    return this.props;
  }
}
