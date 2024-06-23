import { UserEmail, UserId, UserPassword } from '../Domain/ValueObjects';

describe('Value Objects', () => {
  describe('UserId', () => {
    it('should create a UserId instance with the provided value', () => {
      const value = '123';
      const userId = new UserId(value);
      expect(userId.toValue()).toEqual({
        value,
      });
    });
  });

  describe('UserEmail', () => {
    it('should create a UserEmail instance with the provided value', () => {
      const value = 'test@example.com';
      const userEmail = new UserEmail(value);
      expect(userEmail.toValue()).toEqual({
        value,
      });
    });
  });

  describe('UserPassword', () => {
    it('should create a UserPassword instance with the provided value', () => {
      const value = 'password123';
      const userPassword = new UserPassword(value);
      expect(userPassword.toValue()).toEqual({
        value,
      });
    });
  });
});
