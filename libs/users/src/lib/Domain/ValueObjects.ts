import { BaseValueObject } from '@mmda/core';
export type UserIdProps = {
  value: string;
};

export class UserId extends BaseValueObject<UserIdProps> {
  constructor(value: string) {
    super({ value });
  }
}

export type UserEmailProps = {
  value: string;
};

export class UserEmail extends BaseValueObject<UserEmailProps> {
  constructor(value: string) {
    super({ value });
  }
}

export type UserPasswordProps = {
  value: string;
};

export class UserPassword extends BaseValueObject<UserPasswordProps> {
  constructor(value: string) {
    super({ value });
  }
}
