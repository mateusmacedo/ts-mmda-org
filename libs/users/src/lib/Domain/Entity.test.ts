import { UserEntity, UserProps } from './Entity';
import { UserEmail, UserId, Username, UserPassword } from './ValueObjects';
describe('UserEntity Tests', () => {
  const validProps = {
    id: new UserId('123'),
    email: new UserEmail('test@example.com'),
    password: new UserPassword('password123'),
    name: new Username('John Doe'),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as UserProps;

  it('should create a UserEntity instance with valid props', () => {
    const entity = new UserEntity(validProps);
    expect(entity).toBeInstanceOf(UserEntity);
    expect(entity.getId()).toBe(validProps.id);
    expect(entity.getEmail()).toBe(validProps.email);
    expect(entity.getPassword()).toBe(validProps.password);
    expect(entity.getName()).toBe(validProps.name);
    expect(entity.getCreatedAt()).toEqual(validProps.createdAt);
    expect(entity.getUpdatedAt()).toEqual(validProps.updatedAt);
    expect(entity.getDeletedAt()).toBeNull();
    expect(entity.getVersion()).toBe(1);
  });

  it('should change email of UserEntity instance', () => {
    const entity = new UserEntity(validProps);
    const newEmail = new UserEmail('newemail@example.com');
    entity.changeEmail(newEmail);
    expect(entity.getEmail()).toBe(newEmail);
    expect(entity.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should change password of UserEntity instance', () => {
    const entity = new UserEntity(validProps);
    const newPassword = new UserPassword('newpassword123');
    entity.changePassword(newPassword);
    expect(entity.getPassword()).toBe(newPassword);
    expect(entity.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should change name of UserEntity instance', () => {
    const entity = new UserEntity(validProps);
    const newName = new Username('Jane Doe');
    entity.changeName(newName);
    expect(entity.getName()).toBe(newName);
    expect(entity.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should throw error when changing name to empty', () => {
    const entity = new UserEntity(validProps);
    expect(() => entity.changeName(new Username(''))).toThrow('Name cannot be empty');
  });

  it('should delete UserEntity instance', () => {
    const entity = new UserEntity(validProps);
    entity.delete();
    expect(entity.getDeletedAt()).not.toBeNull();
    expect(entity.getUpdatedAt()).toBeInstanceOf(Date);
  });
});
