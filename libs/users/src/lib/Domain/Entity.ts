import { BaseEntity, BaseEntityProps, EntityProps } from '@mmda/core';
import { UserEmail, UserId, UserPassword } from './ValueObjects';

export type UserProps = {
  id: UserId;
  email: UserEmail;
  password: UserPassword;
  name: string;
} & BaseEntityProps<UserId>;

export class UserEntity extends BaseEntity<UserProps, UserId> {
  constructor(props: EntityProps<UserProps>) {
    super({
      ...props,
    });
  }

  public getEmail(): UserEmail {
    return this.props.email;
  }

  public getName(): string {
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

  public changeName(newName: string): void {
    if (!newName) {
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
