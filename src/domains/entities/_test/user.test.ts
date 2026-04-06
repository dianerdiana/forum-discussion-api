import { DomainError } from '@/domains/commons/index.js';
import { Fullname, Password, UserId, Username } from '@/domains/value-objects/index.js';

import { User } from '../user.js';

describe('User', () => {
  describe('create', () => {
    it('should create a User entity with required fields', () => {
      // Arrange
      const props = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret_pass',
      };

      // Action
      const user = User.create(props);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBeInstanceOf(UserId);
      expect(user.username).toBeInstanceOf(Username);
      expect(user.username.value).toBe(props.username);
      expect(user.fullname).toBeInstanceOf(Fullname);
      expect(user.fullname.value).toBe(props.fullname);
      expect(user.password).toBeInstanceOf(Password);
      expect(user.password.value).toBe(props.password);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should use provided id when given', () => {
      // Arrange
      const props = {
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret_pass',
      };

      // Action
      const user = User.create(props);

      // Assert
      expect(user.id.value).toBe('user-123');
    });

    it('should throw DomainError when username is empty', () => {
      // Arrange
      const props = {
        username: '',
        fullname: 'Dicoding Indonesia',
        password: 'secret_pass',
      };

      // Action & Assert
      expect(() => User.create(props)).toThrow(DomainError);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a User entity from persistence data', () => {
      // Arrange
      const createdAt = new Date('2026-04-06T00:00:00.000Z');
      const updatedAt = new Date('2024-06-01T00:00:00.000Z');
      const props = {
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'hashed_password',
        createdAt,
        updatedAt,
      };

      // Action
      const user = User.reconstitute(props);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.id.value).toBe(props.id);
      expect(user.username.value).toBe(props.username);
      expect(user.fullname.value).toBe(props.fullname);
      expect(user.password.value).toBe(props.password);
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
    });
  });

  describe('updateFullname', () => {
    it('should update fullname and set new updatedAt', () => {
      // Arrange
      const user = User.create({
        username: 'dicoding',
        fullname: 'Old Fullname',
        password: 'secret_pass',
      });
      const previousUpdatedAt = user.updatedAt;

      // Action
      user.updateFullname(Fullname.create('New Fullname'));

      // Assert
      expect(user.fullname.value).toBe('New Fullname');
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
    });
  });

  describe('updateUsername', () => {
    it('should update username and set new updatedAt', () => {
      // Arrange
      const user = User.create({
        username: 'old_username',
        fullname: 'Dicoding Indonesia',
        password: 'secret_pass',
      });
      const previousUpdatedAt = user.updatedAt;

      // Action
      user.updateUsername(Username.create('new_username'));

      // Assert
      expect(user.username.value).toBe('new_username');
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
    });
  });

  describe('equals', () => {
    it('should return true when two users have the same id', () => {
      // Arrange
      const user1 = User.create({
        id: 'user-123',
        username: 'user_one',
        fullname: 'User One',
        password: 'pass',
      });
      const user2 = User.create({
        id: 'user-123',
        username: 'user_two',
        fullname: 'User Two',
        password: 'pass',
      });

      // Action
      const result = user1.equals(user2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two users have different ids', () => {
      // Arrange
      const user1 = User.create({
        id: 'user-123',
        username: 'user_one',
        fullname: 'User One',
        password: 'pass',
      });
      const user2 = User.create({
        id: 'user-456',
        username: 'user_two',
        fullname: 'User Two',
        password: 'pass',
      });

      // Action
      const result = user1.equals(user2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toPersistence', () => {
    it('should return a plain object with all fields', () => {
      // Arrange
      const createdAt = new Date('2026-04-06T00:00:00.000Z');
      const user = User.reconstitute({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'hashed_password',
        createdAt,
        updatedAt: createdAt,
      });

      // Action
      const result = user.toPersistence();

      // Assert
      expect(result).toStrictEqual({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'hashed_password',
        createdAt,
        updatedAt: createdAt,
      });
    });
  });
});
