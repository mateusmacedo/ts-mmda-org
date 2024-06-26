import { IFactory, IIdentityGenerator, RepositoryError } from '@mmda/core';
import { UserEntity } from '../Domain/Entity';
import { IUserRepository } from '../Domain/Repository';
import { IUserService } from '../Domain/Services';
import { UserEmail, UserId, UserPassword, Username } from '../Domain/ValueObjects';
import { UserApplicationService } from './Services';

describe('UserApplicationService', () => {
  let userApplicationService: UserApplicationService;
  let identityGeneratorMock: jest.Mocked<IIdentityGenerator<string>>;
  let userServiceMock: jest.Mocked<IUserService>;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let factoryMock: jest.Mocked<IFactory>;

  beforeEach(() => {
    identityGeneratorMock = { generate: jest.fn() } as jest.Mocked<IIdentityGenerator<string>>;
    userServiceMock = {
      registerUser: jest.fn(),
      changeEmail: jest.fn(),
      changePassword: jest.fn(),
      deleteUser: jest.fn(),
    } as jest.Mocked<IUserService>;

    userRepositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    factoryMock = {
      create: jest.fn(),
    } as jest.Mocked<IFactory>;

    userApplicationService = new UserApplicationService(
      identityGeneratorMock,
      userServiceMock,
      userRepositoryMock,
      factoryMock,
    );
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const name = 'Test User';
      const generatedId = 'unique-id';

      identityGeneratorMock.generate.mockReturnValue(generatedId);
      factoryMock.create.mockImplementation((cls, args) => new cls(...args));
      userServiceMock.registerUser.mockReturnValue(
        new UserEntity({
          id: new UserId(generatedId),
          email: new UserEmail(email),
          password: new UserPassword(password),
          name: new Username(name),
        }),
      );

      userRepositoryMock.findByEmail.mockResolvedValue(null);

      const result = await userApplicationService.registerUser(name, email, password);

      expect(identityGeneratorMock.generate).toHaveBeenCalled();
      expect(factoryMock.create).toHaveBeenCalledWith(UserEmail, [email]);
      expect(factoryMock.create).toHaveBeenCalledWith(UserPassword, [password]);
      expect(factoryMock.create).toHaveBeenCalledWith(UserId, [generatedId]);
      expect(userServiceMock.registerUser).toHaveBeenCalled();
      expect(userRepositoryMock.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(UserEntity);
    });

    it('should throw an error if user already exists', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const name = 'Test User';
      userRepositoryMock.findByEmail.mockResolvedValue(
        new UserEntity({
          id: new UserId('existing-id'),
          email: new UserEmail(email),
          password: new UserPassword(password),
          name: new Username(name),
        }),
      );

      await expect(userApplicationService.registerUser(name, email, password)).rejects.toThrow(
        RepositoryError,
      );
    });
  });

  describe('changeUserEmail', () => {
    it('should change the user email', async () => {
      const userId = new UserId('user-id');
      const newEmail = 'new@example.com';
      const user = new UserEntity({
        id: userId,
        email: new UserEmail('old@example.com'),
        password: new UserPassword('password'),
        name: new Username('Test User'),
      });

      userRepositoryMock.findById.mockResolvedValue(user);
      factoryMock.create.mockImplementation((cls, args) => new cls(...args));

      await userApplicationService.changeUserEmail(userId, newEmail);

      expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
      expect(factoryMock.create).toHaveBeenCalledWith(UserEmail, [newEmail]);
      expect(userServiceMock.changeEmail).toHaveBeenCalledWith(user, expect.any(UserEmail));
      expect(userRepositoryMock.save).toHaveBeenCalledWith(user);
    });

    it('should throw an error if user not found', async () => {
      const userId = new UserId('user-id');
      const newEmail = 'new@example.com';

      userRepositoryMock.findById.mockResolvedValue(null);

      await expect(userApplicationService.changeUserEmail(userId, newEmail)).rejects.toThrow(
        RepositoryError,
      );
    });
  });

  describe('changeUserPassword', () => {
    it('should change the user password', async () => {
      const userId = new UserId('user-id');
      const newPassword = 'newPassword123';
      const user = new UserEntity({
        id: userId,
        email: new UserEmail('test@example.com'),
        password: new UserPassword('oldPassword123'),
        name: new Username('Test User'),
      });

      userRepositoryMock.findById.mockResolvedValue(user);
      factoryMock.create.mockImplementation((cls, args) => new cls(...args));

      await userApplicationService.changeUserPassword(userId, newPassword);

      expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
      expect(factoryMock.create).toHaveBeenCalledWith(UserPassword, [newPassword]);
      expect(userServiceMock.changePassword).toHaveBeenCalledWith(user, expect.any(UserPassword));
      expect(userRepositoryMock.save).toHaveBeenCalledWith(user);
    });

    it('should throw an error if user not found', async () => {
      const userId = new UserId('user-id');
      const newPassword = 'newPassword123';

      userRepositoryMock.findById.mockResolvedValue(null);

      await expect(userApplicationService.changeUserPassword(userId, newPassword)).rejects.toThrow(
        RepositoryError,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      const userId = new UserId('user-id');
      const user = new UserEntity({
        id: userId,
        email: new UserEmail('test@example.com'),
        password: new UserPassword('password123'),
        name: new Username('Test User'),
      });

      userRepositoryMock.findById.mockResolvedValue(user);

      await userApplicationService.deleteUser(userId);

      expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
      expect(userServiceMock.deleteUser).toHaveBeenCalledWith(user);
      expect(userRepositoryMock.delete).toHaveBeenCalledWith(user);
    });

    it('should throw an error if user not found', async () => {
      const userId = new UserId('user-id');

      userRepositoryMock.findById.mockResolvedValue(null);

      await expect(userApplicationService.deleteUser(userId)).rejects.toThrow(RepositoryError);
    });
  });

  describe('getUserById', () => {
    it('should return the user by ID', async () => {
      const userId = new UserId('user-id');
      const user = new UserEntity({
        id: userId,
        email: new UserEmail('test@example.com'),
        password: new UserPassword('password123'),
        name: new Username('Test User'),
      });

      userRepositoryMock.findById.mockResolvedValue(user);

      const result = await userApplicationService.getUserById(userId);

      expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
      expect(result).toBe(user);
    });

    it('should return null if user not found', async () => {
      const userId = new UserId('user-id');

      userRepositoryMock.findById.mockResolvedValue(null);

      const result = await userApplicationService.getUserById(userId);

      expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return the user by email', async () => {
      const email = 'test@example.com';
      const user = new UserEntity({
        id: new UserId('user-id'),
        email: new UserEmail(email),
        password: new UserPassword('password123'),
        name: new Username('Test User'),
      });

      userRepositoryMock.findByEmail.mockResolvedValue(user);
      factoryMock.create.mockImplementation((cls, args) => new cls(...args));

      const result = await userApplicationService.getUserByEmail(email);

      expect(factoryMock.create).toHaveBeenCalledWith(UserEmail, [email]);
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(expect.any(UserEmail));
      expect(result).toBe(user);
    });

    it('should return null if user not found', async () => {
      const email = 'test@example.com';

      userRepositoryMock.findByEmail.mockResolvedValue(null);
      factoryMock.create.mockImplementation((cls, args) => new cls(...args));

      const result = await userApplicationService.getUserByEmail(email);

      expect(factoryMock.create).toHaveBeenCalledWith(UserEmail, [email]);
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(expect.any(UserEmail));
      expect(result).toBeNull();
    });
  });
});
