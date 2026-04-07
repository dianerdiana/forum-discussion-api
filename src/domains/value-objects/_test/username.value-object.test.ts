import { DomainError } from '@/domains/commons/index.js';

import { Username } from '../username.value-object.js';

describe('Username', () => {
  describe('constructor', () => {
    it('should create a Username with a valid string', () => {
      // Arrange
      const value = 'dicoding';

      // Action
      const username = new Username(value);

      // Assert
      expect(username).toBeInstanceOf(Username);
      expect(username.value).toBe(value);
    });

    it('should trim whitespace from the value', () => {
      // Arrange
      const value = '  dicoding  ';

      // Action
      const username = new Username(value);

      // Assert
      expect(username.value).toBe('dicoding');
    });

    it('should throw DomainError when value is not a string', () => {
      // Arrange
      const value = 123 as unknown as string;

      // Action & Assert
      expect(() => new Username(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new Username(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new Username(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is too short (less than 2 characters)', () => {
      // Arrange
      const value = 'a';

      // Action & Assert
      expect(() => new Username(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value exceeds 50 characters', () => {
      // Arrange
      const value = 'a'.repeat(51);

      // Action & Assert
      expect(() => new Username(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value contains invalid characters', () => {
      // Arrange
      const value = 'dicoding!';

      // Action & Assert
      expect(() => new Username(value)).toThrow(DomainError);
    });

    it('should allow underscores in the value', () => {
      // Arrange
      const value = 'dicoding_indonesia';

      // Action
      const username = new Username(value);

      // Assert
      expect(username.value).toBe(value);
    });
  });

  describe('create', () => {
    it('should create a Username via static factory method', () => {
      // Arrange
      const value = 'dicoding';

      // Action
      const username = Username.create(value);

      // Assert
      expect(username).toBeInstanceOf(Username);
      expect(username.value).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true when two Username instances have the same value', () => {
      // Arrange
      const username1 = Username.create('dicoding');
      const username2 = Username.create('dicoding');

      // Action
      const result = username1.equals(username2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two Username instances have different values', () => {
      // Arrange
      const username1 = Username.create('dicoding');
      const username2 = Username.create('johndoe');

      // Action
      const result = username1.equals(username2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'dicoding';
      const username = Username.create(value);

      // Action
      const result = username.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
