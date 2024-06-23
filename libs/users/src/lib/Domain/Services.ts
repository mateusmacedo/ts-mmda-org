import { IFactory } from '@mmda/core';
import { UserEntity } from './Entity';
import { UserEmail, UserId, UserPassword } from './ValueObjects';

export interface IUserService {
  registerUser(userId: UserId, name: string, email: UserEmail, password: UserPassword): UserEntity;
  changeEmail(user: UserEntity, newEmail: UserEmail): void;
  changePassword(user: UserEntity, newPassword: UserPassword): void;
  deleteUser(user: UserEntity): void;
}

export class UserService implements IUserService {
  constructor(private factory: IFactory) {}

  registerUser(userId: UserId, name: string, email: UserEmail, password: UserPassword): UserEntity {
    const user = this.factory.create<UserEntity>(UserEntity, [
      {
        id: userId,
        email: email,
        password: password,
        name,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);

    return user;
  }

  changeEmail(user: UserEntity, newEmail: UserEmail): void {
    user.changeEmail(newEmail);
  }

  changePassword(user: UserEntity, newPassword: UserPassword): void {
    user.changePassword(newPassword);
  }

  deleteUser(user: UserEntity): void {
    user.delete();
  }
}
