export type ValueObjectProps<T> = {
  [Property in keyof T]?: T[Property];
};

export interface ValueObject<T extends ValueObjectProps<T>> {
  equals(value: ValueObject<T>): boolean;
  toString(): string;
  toValue(): ValueObjectProps<T>;
}

export abstract class BaseValueObject<T extends ValueObjectProps<T>> implements ValueObject<T> {
  constructor(protected props: T) {
    this.props = props ?? ({} as T);
  }

  public equals(vo: ValueObject<T>): boolean {
    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }

    const otherProps = vo.toValue();
    return this.compareProps(this.props, otherProps);
  }

  private compareProps(props1: ValueObjectProps<T>, props2: ValueObjectProps<T>): boolean {
    const keys1 = Object.keys(props1);
    const keys2 = Object.keys(props2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!Object.prototype.hasOwnProperty.call(props2, key) || props1[key] !== props2[key]) {
        return false;
      }
    }
    return true;
  }

  public toString(): string {
    return JSON.stringify(this.props);
  }

  public toValue(): T {
    return this.props;
  }
}
