import { UserEntity } from './Entity';
import { UserEmail, UserId, Username } from './ValueObjects';

export interface IUserRepository {
  findByEmail(email: UserEmail): Promise<UserEntity | null>;
  findByName(name: Username): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<UserEntity>;
  delete(user: UserEntity): Promise<void>;
  findById(id: UserId): Promise<UserEntity | null>;
}
