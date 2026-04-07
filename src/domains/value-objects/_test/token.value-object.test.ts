import { DomainError } from '@/domains/commons/index.js';

import { Token } from '../token.value-object.js';

describe('Token', () => {
  describe('constructor', () => {
    it('should create a Token with a valid string', () => {
      // Arrange
      const value = 'valid.jwt.token';

      // Action
      const token = new Token(value);

      // Assert
      expect(token).toBeInstanceOf(Token);
      expect(token.value).toBe(value);
    });

    it('should trim whitespace from the value', () => {
      // Arrange
      const value = '  valid.jwt.token  ';

      // Action
      const token = new Token(value);

      // Assert
      expect(token.value).toBe('valid.jwt.token');
    });

    it('should throw DomainError when value is not a string', () => {
      // Arrange
      const value = 123 as unknown as string;

      // Action & Assert
      expect(() => new Token(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new Token(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new Token(value)).toThrow(DomainError);
    });
  });

  describe('create', () => {
    it('should create a Token via static factory method', () => {
      // Arrange
      const value = 'valid.jwt.token';

      // Action
      const token = Token.create(value);

      // Assert
      expect(token).toBeInstanceOf(Token);
      expect(token.value).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true when two Token instances have the same value', () => {
      // Arrange
      const token1 = Token.create('valid.jwt.token');
      const token2 = Token.create('valid.jwt.token');

      // Action
      const result = token1.equals(token2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when two Token instances have the same value with different casing', () => {
      // Arrange
      const token1 = Token.create('Valid.JWT.Token');
      const token2 = Token.create('valid.jwt.token');

      // Action
      const result = token1.equals(token2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two Token instances have different values', () => {
      // Arrange
      const token1 = Token.create('valid.jwt.token');
      const token2 = Token.create('other.jwt.token');

      // Action
      const result = token1.equals(token2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'valid.jwt.token';
      const token = Token.create(value);

      // Action
      const result = token.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
