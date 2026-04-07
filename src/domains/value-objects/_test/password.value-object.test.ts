import { DomainError } from '@/domains/commons/index.js';

import { Password } from '../password.value-object.js';

describe('Password', () => {
  describe('constructor', () => {
    it('should create a Password with a valid string', () => {
      // Arrange
      const value = 'secret_password';

      // Action
      const password = new Password(value);

      // Assert
      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(value);
    });

    it('should trim whitespace from the value', () => {
      // Arrange
      const value = '  secret_password  ';

      // Action
      const password = new Password(value);

      // Assert
      expect(password.value).toBe('secret_password');
    });

    it('should throw DomainError when value is not a string', () => {
      // Arrange
      const value = 123 as unknown as string;

      // Action & Assert
      expect(() => new Password(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new Password(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new Password(value)).toThrow(DomainError);
    });
  });

  describe('create', () => {
    it('should create a Password via static factory method', () => {
      // Arrange
      const value = 'secret_password';

      // Action
      const password = Password.create(value);

      // Assert
      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true when two Password instances have the same value', () => {
      // Arrange
      const password1 = Password.create('secret_password');
      const password2 = Password.create('secret_password');

      // Action
      const result = password1.equals(password2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two Password instances have different values', () => {
      // Arrange
      const password1 = Password.create('secret_password');
      const password2 = Password.create('other_password');

      // Action
      const result = password1.equals(password2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'secret_password';
      const password = Password.create(value);

      // Action
      const result = password.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
