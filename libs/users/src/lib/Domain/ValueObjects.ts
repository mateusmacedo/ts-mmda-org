import { ValueObject } from '@mmda/core';
export type UserIdProps = {
  value: string;
};

export class UserId extends ValueObject<UserIdProps> {
  constructor(value: string) {
    super({ value });
  }
}

export type UserEmailProps = {
  value: string;
};

export class UserEmail extends ValueObject<UserEmailProps> {
  constructor(value: string) {
    super({ value });
  }
}

export type UserPasswordProps = {
  value: string;
};

export class UserPassword extends ValueObject<UserPasswordProps> {
  constructor(value: string) {
    super({ value });
  }
}
