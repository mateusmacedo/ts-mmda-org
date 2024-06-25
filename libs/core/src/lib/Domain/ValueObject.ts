export type TValueObjectProps<T> = {
  [Property in keyof T]?: T[Property];
};

export interface IValueObject<T extends TValueObjectProps<T>> {
  equals(value: IValueObject<T>): boolean;
  toString(): string;
  toValue(): TValueObjectProps<T>;
}

export abstract class ValueObject<T extends TValueObjectProps<T>> implements IValueObject<T> {
  protected readonly props: T;

  constructor(props?: T) {
    this.props = Object.freeze(props || ({} as T)); // Ensure immutability and handle undefined props
  }

  public equals(vo: IValueObject<T>): boolean {
    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }
    return this.compareProps(this.props, vo.toValue());
  }

  private compareProps(props1: TValueObjectProps<T>, props2: TValueObjectProps<T>): boolean {
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
          !this.compareProps(val1 as TValueObjectProps<T>, val2 as TValueObjectProps<T>)) ||
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
