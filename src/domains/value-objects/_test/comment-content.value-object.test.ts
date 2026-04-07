import { DomainError } from '@/domains/commons/index.js';

import { CommentContent } from '../comment-content.object-value.js';

describe('CommentContent', () => {
  describe('constructor', () => {
    it('should create a CommentContent with a valid string', () => {
      // Arrange
      const value = 'This is a valid comment';

      // Action
      const content = new CommentContent(value);

      // Assert
      expect(content).toBeInstanceOf(CommentContent);
      expect(content.value).toBe(value);
    });

    it('should trim whitespace from the value', () => {
      // Arrange
      const value = '  trimmed comment  ';

      // Action
      const content = new CommentContent(value);

      // Assert
      expect(content.value).toBe('trimmed comment');
    });

    it('should throw DomainError when value is not a string', () => {
      // Arrange
      const value = 123 as unknown as string;

      // Action & Assert
      expect(() => new CommentContent(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new CommentContent(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new CommentContent(value)).toThrow(DomainError);
    });
  });

  describe('create', () => {
    it('should create a CommentContent via static factory method', () => {
      // Arrange
      const value = 'A comment via static create';

      // Action
      const content = CommentContent.create(value);

      // Assert
      expect(content).toBeInstanceOf(CommentContent);
      expect(content.value).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true when two CommentContent instances have the same value', () => {
      // Arrange
      const content1 = CommentContent.create('same comment');
      const content2 = CommentContent.create('same comment');

      // Action
      const result = content1.equals(content2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two CommentContent instances have different values', () => {
      // Arrange
      const content1 = CommentContent.create('comment one');
      const content2 = CommentContent.create('comment two');

      // Action
      const result = content1.equals(content2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'comment as string';
      const content = CommentContent.create(value);

      // Action
      const result = content.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
