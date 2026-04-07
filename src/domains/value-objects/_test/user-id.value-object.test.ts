import { DomainError } from '@/domains/commons/index.js';

import { UserId } from '../user-id.value-object.js';

describe('UserId', () => {
  describe('constructor', () => {
    it('should create a UserId with a provided value', () => {
      // Arrange
      const value = 'user-123';

      // Action
      const userId = new UserId(value);

      // Assert
      expect(userId).toBeInstanceOf(UserId);
      expect(userId.value).toBe(value);
    });

    it('should generate a UUID when no value is provided', () => {
      // Arrange — no value

      // Action
      const userId = new UserId();

      // Assert
      expect(userId.value).toBeTruthy();
      expect(typeof userId.value).toBe('string');
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new UserId(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new UserId(value)).toThrow(DomainError);
    });
  });

  describe('create', () => {
    it('should create a UserId with a provided value via static factory method', () => {
      // Arrange
      const value = 'user-456';

      // Action
      const userId = UserId.create(value);

      // Assert
      expect(userId).toBeInstanceOf(UserId);
      expect(userId.value).toBe(value);
    });

    it('should generate a UUID when no value is provided via static factory method', () => {
      // Arrange — no value

      // Action
      const userId = UserId.create();

      // Assert
      expect(userId.value).toBeTruthy();
      expect(typeof userId.value).toBe('string');
    });
  });

  describe('equals', () => {
    it('should return true when two UserId instances have the same value', () => {
      // Arrange
      const userId1 = UserId.create('user-123');
      const userId2 = UserId.create('user-123');

      // Action
      const result = userId1.equals(userId2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two UserId instances have different values', () => {
      // Arrange
      const userId1 = UserId.create('user-123');
      const userId2 = UserId.create('user-456');

      // Action
      const result = userId1.equals(userId2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'user-789';
      const userId = UserId.create(value);

      // Action
      const result = userId.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
