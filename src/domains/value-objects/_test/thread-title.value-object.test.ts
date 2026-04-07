import { DomainError } from '@/domains/commons/index.js';

import { ThreadTitle } from '../thread-title.object-value.js';

describe('ThreadTitle', () => {
  describe('constructor', () => {
    it('should create a ThreadTitle with a valid string', () => {
      // Arrange
      const value = 'This is a valid thread title';

      // Action
      const threadTitle = new ThreadTitle(value);

      // Assert
      expect(threadTitle).toBeInstanceOf(ThreadTitle);
      expect(threadTitle.value).toBe(value);
    });

    it('should trim whitespace from the value', () => {
      // Arrange
      const value = '  trimmed thread title  ';

      // Action
      const threadTitle = new ThreadTitle(value);

      // Assert
      expect(threadTitle.value).toBe('trimmed thread title');
    });

    it('should throw DomainError when value is not a string', () => {
      // Arrange
      const value = 123 as unknown as string;

      // Action & Assert
      expect(() => new ThreadTitle(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new ThreadTitle(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new ThreadTitle(value)).toThrow(DomainError);
    });
  });

  describe('create', () => {
    it('should create a ThreadTitle via static factory method', () => {
      // Arrange
      const value = 'A thread title via static create';

      // Action
      const threadTitle = ThreadTitle.create(value);

      // Assert
      expect(threadTitle).toBeInstanceOf(ThreadTitle);
      expect(threadTitle.value).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true when two ThreadTitle instances have the same value', () => {
      // Arrange
      const threadTitle1 = ThreadTitle.create('same thread title');
      const threadTitle2 = ThreadTitle.create('same thread title');

      // Action
      const result = threadTitle1.equals(threadTitle2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two ThreadTitle instances have different values', () => {
      // Arrange
      const threadTitle1 = ThreadTitle.create('thread title one');
      const threadTitle2 = ThreadTitle.create('thread title two');

      // Action
      const result = threadTitle1.equals(threadTitle2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'thread title as string';
      const threadTitle = ThreadTitle.create(value);

      // Action
      const result = threadTitle.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
