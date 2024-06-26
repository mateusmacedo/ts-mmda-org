import { IFactory, IIdentityGenerator, RepositoryError } from '@mmda/core';
import { UserEntity } from '../Domain/Entity';
import { IUserRepository } from '../Domain/Repository';
import { IUserService } from '../Domain/Services';
import { UserEmail, UserId, Username, UserPassword } from '../Domain/ValueObjects';
import { TRegisterUserDto } from './Dtos';

export class UserApplicationService {
  constructor(
    private identityGenerator: IIdentityGenerator<string>,
    private userService: IUserService,
    private userRepository: IUserRepository,
    private factory: IFactory,
  ) {}

  async registerUser(dto: TRegisterUserDto): Promise<UserEntity> {
    const userEmail = this.factory.create<UserEmail>(UserEmail, [dto.email]);
    const userPassword = this.factory.create<UserPassword>(UserPassword, [dto.password]);
    const username = this.factory.create<Username>(Username, [dto.name]);

    const id = dto.id ?? this.identityGenerator.generate();
    const userId = this.factory.create<UserId>(UserId, [id]);

    const existingUser = await this.userRepository.findByEmail(userEmail);
    if (existingUser) {
      throw new RepositoryError('User already exists');
    }

    const user = this.userService.registerUser(userId, username, userEmail, userPassword);
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
