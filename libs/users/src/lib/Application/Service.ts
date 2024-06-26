import { IdentityGenerator, IFactory, RepositoryError } from '@mmda/core';
import { UserEntity } from '../Domain/Entity';
import { IUserRepository } from '../Domain/Repository';
import { IUserService } from '../Domain/Services';
import { UserEmail, UserId, UserPassword } from '../Domain/ValueObjects';

export class UserApplicationService {
  constructor(
    private identityGenerator: IdentityGenerator<string>,
    private userService: IUserService,
    private userRepository: IUserRepository,
    private factory: IFactory,
  ) {}

  async registerUser(name: string, email: string, password: string): Promise<UserEntity> {
    const userEmail = this.factory.create<UserEmail>(UserEmail, [email]);
    const userPassword = this.factory.create<UserPassword>(UserPassword, [password]);
    const userId = this.factory.create<UserId>(UserId, [this.identityGenerator.generate()]);

    const existingUser = await this.userRepository.findByEmail(userEmail);
    if (existingUser) {
      throw new RepositoryError('User already exists');
    }

    const user = this.userService.registerUser(userId, name, userEmail, userPassword);
    await this.userRepository.save(user);

    return user;
  }

  async changeUserEmail(userId: UserId, newEmail: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new RepositoryError('User not found');
    }

    const userEmail = this.factory.create<UserEmail>(UserEmail, [newEmail]);
    this.userService.changeEmail(user, userEmail);

    await this.userRepository.save(user);
  }

  async changeUserPassword(userId: UserId, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new RepositoryError('User not found');
    }

    const userPassword = this.factory.create<UserPassword>(UserPassword, [newPassword]);
    this.userService.changePassword(user, userPassword);

    await this.userRepository.save(user);
  }

  async deleteUser(userId: UserId): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new RepositoryError('User not found');
    }

    this.userService.deleteUser(user);

    await this.userRepository.delete(user);
  }

  async getUserById(userId: UserId): Promise<UserEntity | null> {
    return this.userRepository.findById(userId);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const userEmail = this.factory.create<UserEmail>(UserEmail, [email]);
    return this.userRepository.findByEmail(userEmail);
  }
}
