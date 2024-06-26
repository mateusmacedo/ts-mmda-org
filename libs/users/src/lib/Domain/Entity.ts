import { Entity, TBaseProps, TEntityProps } from '@mmda/core';
import { UserEmail, UserId, Username, UserPassword } from './ValueObjects';

export type UserProps = {
  id: UserId;
  email: UserEmail;
  password: UserPassword;
  name: Username;
} & TBaseProps<UserId>;

export class UserEntity extends Entity<UserProps, UserId> {
  constructor(props: TEntityProps<UserProps>) {
    super({
      ...props,
    });
  }

  public getEmail(): UserEmail {
    return this.props.email;
  }

  public getName(): Username {
    return this.props.name;
  }

  public getPassword(): UserPassword {
    return this.props.password;
  }

  public changeEmail(newEmail: UserEmail): void {
    this.props.email = newEmail;
    this.updateTimestamp();
  }

  public changePassword(newPassword: UserPassword): void {
    this.props.password = newPassword;
    this.updateTimestamp();
  }

  public changeName(newName: Username): void {
    if (!newName.toValue().value || newName.toValue().value === '') {
      throw new Error('Name cannot be empty');
    }
    this.props.name = newName;
    this.updateTimestamp();
  }

  public delete(): void {
    this.setDeletedAt(new Date());
  }

  private updateTimestamp(): void {
    this.props.updatedAt = new Date();
  }
}
