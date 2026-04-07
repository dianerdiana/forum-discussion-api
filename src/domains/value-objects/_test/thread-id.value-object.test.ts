import { DomainError } from '@/domains/commons/index.js';

import { ThreadId } from '../thread-id.value-object.js';

describe('ThreadId', () => {
  describe('constructor', () => {
    it('should create a ThreadId with a provided value', () => {
      // Arrange
      const value = 'thread-123';

      // Action
      const threadId = new ThreadId(value);

      // Assert
      expect(threadId).toBeInstanceOf(ThreadId);
      expect(threadId.value).toBe(value);
    });

    it('should generate a UUID when no value is provided', () => {
      // Arrange — no value

      // Action
      const threadId = new ThreadId();

      // Assert
      expect(threadId.value).toBeTruthy();
      expect(typeof threadId.value).toBe('string');
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new ThreadId(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new ThreadId(value)).toThrow(DomainError);
    });
  });

  describe('create', () => {
    it('should create a ThreadId with a provided value via static factory method', () => {
      // Arrange
      const value = 'thread-456';

      // Action
      const threadId = ThreadId.create(value);

      // Assert
      expect(threadId).toBeInstanceOf(ThreadId);
      expect(threadId.value).toBe(value);
    });

    it('should generate a UUID when no value is provided via static factory method', () => {
      // Arrange — no value

      // Action
      const threadId = ThreadId.create();

      // Assert
      expect(threadId.value).toBeTruthy();
      expect(typeof threadId.value).toBe('string');
    });
  });

  describe('equals', () => {
    it('should return true when two ThreadId instances have the same value', () => {
      // Arrange
      const threadId1 = ThreadId.create('thread-123');
      const threadId2 = ThreadId.create('thread-123');

      // Action
      const result = threadId1.equals(threadId2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two ThreadId instances have different values', () => {
      // Arrange
      const threadId1 = ThreadId.create('thread-123');
      const threadId2 = ThreadId.create('thread-456');

      // Action
      const result = threadId1.equals(threadId2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'thread-789';
      const threadId = ThreadId.create(value);

      // Action
      const result = threadId.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
