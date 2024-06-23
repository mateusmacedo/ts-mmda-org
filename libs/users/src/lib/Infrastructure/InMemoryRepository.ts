import { InMemoryRepository } from '@mmda/core';
import { UserEntity } from '../Domain/Entity';
import { IUserRepository } from '../Domain/Repository';
import { UserEmail, UserId } from '../Domain/ValueObjects';

export class InMemoryUserRepository
  extends InMemoryRepository<UserEntity, UserId>
  implements IUserRepository
{
  async findByEmail(email: UserEmail): Promise<UserEntity | null> {
    const users = await this.findAll();
    return users.find((user) => user.getEmail().toString() === email.toString()) || null;
  }

  async findByName(name: string): Promise<UserEntity[]> {
    const users = await this.findAll();
    return users.filter((user) => user.getName() === name);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return super.save(user);
  }

  async delete(user: UserEntity): Promise<void> {
    return super.delete(user);
  }

  async findById(id: UserId): Promise<UserEntity | null> {
    return super.findById(id);
  }
}
