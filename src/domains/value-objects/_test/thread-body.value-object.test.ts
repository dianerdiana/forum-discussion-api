import { DomainError } from '@/domains/commons/index.js';

import { ThreadBody } from '../thread-body.object-value.js';

describe('ThreadBody', () => {
  describe('constructor', () => {
    it('should create a ThreadBody with a valid string', () => {
      // Arrange
      const value = 'This is a valid thread body';

      // Action
      const threadBody = new ThreadBody(value);

      // Assert
      expect(threadBody).toBeInstanceOf(ThreadBody);
      expect(threadBody.value).toBe(value);
    });

    it('should trim whitespace from the value', () => {
      // Arrange
      const value = '  trimmed thread body  ';

      // Action
      const threadBody = new ThreadBody(value);

      // Assert
      expect(threadBody.value).toBe('trimmed thread body');
    });

    it('should throw DomainError when value is not a string', () => {
      // Arrange
      const value = 123 as unknown as string;

      // Action & Assert
      expect(() => new ThreadBody(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new ThreadBody(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new ThreadBody(value)).toThrow(DomainError);
    });
  });

  describe('create', () => {
    it('should create a ThreadBody via static factory method', () => {
      // Arrange
      const value = 'A thread body via static create';

      // Action
      const threadBody = ThreadBody.create(value);

      // Assert
      expect(threadBody).toBeInstanceOf(ThreadBody);
      expect(threadBody.value).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true when two ThreadBody instances have the same value', () => {
      // Arrange
      const threadBody1 = ThreadBody.create('same thread body');
      const threadBody2 = ThreadBody.create('same thread body');

      // Action
      const result = threadBody1.equals(threadBody2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two ThreadBody instances have different values', () => {
      // Arrange
      const threadBody1 = ThreadBody.create('thread body one');
      const threadBody2 = ThreadBody.create('thread body two');

      // Action
      const result = threadBody1.equals(threadBody2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'thread body as string';
      const threadBody = ThreadBody.create(value);

      // Action
      const result = threadBody.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
