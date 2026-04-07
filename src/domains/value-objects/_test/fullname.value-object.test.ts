import { DomainError } from '@/domains/commons/index.js';

import { Fullname } from '../fullname.value-object.js';

describe('Fullname', () => {
  describe('constructor', () => {
    it('should create a Fullname with a valid string', () => {
      // Arrange
      const value = 'Dicoding Indonesia';

      // Action
      const fullname = new Fullname(value);

      // Assert
      expect(fullname).toBeInstanceOf(Fullname);
      expect(fullname.value).toBe(value);
    });

    it('should trim whitespace from the value', () => {
      // Arrange
      const value = '  Dicoding Indonesia  ';

      // Action
      const fullname = new Fullname(value);

      // Assert
      expect(fullname.value).toBe('Dicoding Indonesia');
    });

    it('should throw DomainError when value is not a string', () => {
      // Arrange
      const value = 123 as unknown as string;

      // Action & Assert
      expect(() => new Fullname(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new Fullname(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new Fullname(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is too short (less than 2 characters)', () => {
      // Arrange
      const value = 'A';

      // Action & Assert
      expect(() => new Fullname(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value exceeds 100 characters', () => {
      // Arrange
      const value = 'A'.repeat(101);

      // Action & Assert
      expect(() => new Fullname(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value contains invalid characters', () => {
      // Arrange
      const value = 'Dicoding123';

      // Action & Assert
      expect(() => new Fullname(value)).toThrow(DomainError);
    });

    it('should allow hyphens and apostrophes in the value', () => {
      // Arrange
      const value = "Mary-Jane O'Brien";

      // Action
      const fullname = new Fullname(value);

      // Assert
      expect(fullname.value).toBe(value);
    });
  });

  describe('create', () => {
    it('should create a Fullname via static factory method', () => {
      // Arrange
      const value = 'Dicoding Indonesia';

      // Action
      const fullname = Fullname.create(value);

      // Assert
      expect(fullname).toBeInstanceOf(Fullname);
      expect(fullname.value).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true when two Fullname instances have the same value', () => {
      // Arrange
      const fullname1 = Fullname.create('Dicoding Indonesia');
      const fullname2 = Fullname.create('Dicoding Indonesia');

      // Action
      const result = fullname1.equals(fullname2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two Fullname instances have different values', () => {
      // Arrange
      const fullname1 = Fullname.create('Dicoding Indonesia');
      const fullname2 = Fullname.create('John Doe');

      // Action
      const result = fullname1.equals(fullname2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'Dicoding Indonesia';
      const fullname = Fullname.create(value);

      // Action
      const result = fullname.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
