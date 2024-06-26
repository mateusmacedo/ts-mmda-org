import { IFactory, IIdentityGenerator, RepositoryError } from '@mmda/core';
import { UserEntity } from '../Domain/Entity';
import { IUserRepository } from '../Domain/Repository';
import { IUserService } from '../Domain/Services';
import { UserEmail, UserId, Username, UserPassword } from '../Domain/ValueObjects';
import { TChangeUserEmailDto, TChangeUserPasswordDto, TRegisterUserDto } from './Dtos';

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

  async changeUserEmail(dto: TChangeUserEmailDto): Promise<void> {
    const userId = this.factory.create<UserId>(UserId, [dto.userId]);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new RepositoryError('User not found');
    }

    const newEmail = this.factory.create<UserEmail>(UserEmail, [dto.newEmail]);
    this.userService.changeEmail(user, newEmail);

    await this.userRepository.save(user);
  }

  async changeUserPassword(dto: TChangeUserPasswordDto): Promise<void> {
    const userId = this.factory.create<UserId>(UserId, [dto.userId]);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new RepositoryError('User not found');
    }

    const userPassword = this.factory.create<UserPassword>(UserPassword, [dto.newPassword]);
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
