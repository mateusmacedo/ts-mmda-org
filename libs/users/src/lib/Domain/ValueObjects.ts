import { ValueObject } from '@mmda/core';
export type TUserIdProps = {
  value: string;
};

export class UserId extends ValueObject<TUserIdProps> {
  constructor(value: string) {
    super({ value });
  }

  toString(): string {
    return this.props.value;
  }
}

export type TUserEmailProps = {
  value: string;
};

export class UserEmail extends ValueObject<TUserEmailProps> {
  constructor(value: string) {
    super({ value });
  }

  toString(): string {
    return this.props.value;
  }
}

export type TUserPasswordProps = {
  value: string;
};

export class UserPassword extends ValueObject<TUserPasswordProps> {
  constructor(value: string) {
    super({ value });
  }

  toString(): string {
    return this.props.value;
  }
}

export type TUsernameProps = {
  value: string;
};

export class Username extends ValueObject<TUsernameProps> {
  constructor(value: string) {
    super({ value });
  }

  toString(): string {
    return this.props.value;
  }
}
