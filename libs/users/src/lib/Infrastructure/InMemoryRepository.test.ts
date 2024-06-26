import { UserEntity } from '../Domain/Entity';
import { UserEmail, UserId, Username, UserPassword } from '../Domain/ValueObjects';
import { InMemoryUserRepository } from './InMemoryRepository';

describe('InMemoryUserRepository', () => {
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
  });

  const createUserEntity = (id: string, email: string, name: string, password: string) => {
    return new UserEntity({
      id: new UserId(id),
      email: new UserEmail(email),
      name: new Username(name),
      password: new UserPassword(password),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 1,
    });
  };

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = createUserEntity('1', 'test@example.com', 'Test User', 'password123');
      await userRepository.save(user);

      const foundUser = await userRepository.findByEmail(new UserEmail('test@example.com'));
      expect(foundUser).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const foundUser = await userRepository.findByEmail(new UserEmail('notfound@example.com'));
      expect(foundUser).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should find users by name', async () => {
      const user1 = createUserEntity('1', 'test1@example.com', 'Test User', 'password123');
      const user2 = createUserEntity('2', 'test2@example.com', 'Test User', 'password456');
      await userRepository.save(user1);
      await userRepository.save(user2);

      const foundUsers = await userRepository.findByName(new Username('Test User'));
      expect(foundUsers).toEqual([user1, user2]);
    });

    it('should return an empty array if no users are found', async () => {
      const foundUsers = await userRepository.findByName(new Username('Nonexistent User'));
      expect(foundUsers).toEqual([]);
    });
  });

  describe('save', () => {
    it('should save a user', async () => {
      const user = createUserEntity('1', 'test@example.com', 'Test User', 'password123');
      await userRepository.save(user);

      const foundUser = await userRepository.findById(new UserId('1'));
      expect(foundUser).toEqual(user);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = createUserEntity('1', 'test@example.com', 'Test User', 'password123');
      await userRepository.save(user);
      await userRepository.delete(user);

      const foundUser = await userRepository.findById(new UserId('1'));
      expect(foundUser).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      const user = createUserEntity('1', 'test@example.com', 'Test User', 'password123');
      await userRepository.save(user);

      const foundUser = await userRepository.findById(new UserId('1'));
      expect(foundUser).toEqual(user);
    });

    it('should return null if user is not found by ID', async () => {
      const foundUser = await userRepository.findById(new UserId('nonexistent'));
      expect(foundUser).toBeNull();
    });
  });
});
