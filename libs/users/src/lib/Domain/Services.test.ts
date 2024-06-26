import { IFactory } from '@mmda/core';
import { UserEntity, UserProps } from './Entity';
import { UserService } from './Services';
import { UserEmail, UserId, Username, UserPassword } from './ValueObjects';

describe('UserService', () => {
  let userService: UserService;
  let factoryMock: jest.Mocked<IFactory>;

  beforeEach(() => {
    factoryMock = {
      create: jest.fn(),
    } as jest.Mocked<IFactory>;

    userService = new UserService(factoryMock);
  });

  describe('registerUser', () => {
    it('should create a new user entity with the provided data', () => {
      const userId = new UserId('1');
      const name = new Username('John Doe');
      const email = new UserEmail('john@example.com');
      const password = new UserPassword('password');
      const now = new Date();

      const expectedUser = new UserEntity({
        id: userId,
        email,
        password,
        name,
        version: 1,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      } as UserProps);

      factoryMock.create.mockReturnValue(expectedUser);

      const user = userService.registerUser(userId, name, email, password);

      expect(factoryMock.create).toHaveBeenCalledWith(UserEntity, [
        expect.objectContaining({
          id: expect.objectContaining({ props: { value: '1' } }),
          email: expect.objectContaining({ props: { value: 'john@example.com' } }),
          password: expect.objectContaining({ props: { value: 'password' } }),
          name: expect.objectContaining({ props: { value: 'John Doe' } }),
          version: 1,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: null,
        }),
      ]);
      expect(user).toEqual(expectedUser);
    });
  });

  describe('changeEmail', () => {
    it('should change the email of the user entity', () => {
      const user = new UserEntity({
        id: new UserId('1'),
        email: new UserEmail('john@example.com'),
        password: new UserPassword('password'),
        name: new Username('John Doe'),
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      const newEmail = new UserEmail('newemail@example.com');

      userService.changeEmail(user, newEmail);

      expect(user.getEmail()).toEqual(newEmail);
    });
  });

  describe('changePassword', () => {
    it('should change the password of the user entity', () => {
      const user = new UserEntity({
        id: new UserId('1'),
        email: new UserEmail('john@example.com'),
        password: new UserPassword('password'),
        name: new Username('John Doe'),
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      const newPassword = new UserPassword('newpassword');

      userService.changePassword(user, newPassword);

      expect(user.getPassword()).toEqual(newPassword);
    });
  });

  describe('deleteUser', () => {
    it('should mark the user entity as deleted', () => {
      const user = new UserEntity({
        id: new UserId('1'),
        email: new UserEmail('john@example.com'),
        password: new UserPassword('password'),
        name: new Username('John Doe'),
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      userService.deleteUser(user);

      expect(user.getDeletedAt()).not.toBeNull();
    });
  });
});
