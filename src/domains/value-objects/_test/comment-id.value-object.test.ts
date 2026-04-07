import { DomainError } from '@/domains/commons/index.js';

import { CommentId } from '../comment-id.value-object.js';

describe('CommentId', () => {
  describe('constructor', () => {
    it('should create a CommentId with a provided value', () => {
      // Arrange
      const value = 'comment-123';

      // Action
      const commentId = new CommentId(value);

      // Assert
      expect(commentId).toBeInstanceOf(CommentId);
      expect(commentId.value).toBe(value);
    });

    it('should generate a UUID when no value is provided', () => {
      // Arrange — no value

      // Action
      const commentId = new CommentId();

      // Assert
      expect(commentId.value).toBeTruthy();
      expect(typeof commentId.value).toBe('string');
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new CommentId(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new CommentId(value)).toThrow(DomainError);
    });
  });

  describe('create', () => {
    it('should create a CommentId with a provided value via static factory method', () => {
      // Arrange
      const value = 'comment-456';

      // Action
      const commentId = CommentId.create(value);

      // Assert
      expect(commentId).toBeInstanceOf(CommentId);
      expect(commentId.value).toBe(value);
    });

    it('should generate a UUID when no value is provided via static factory method', () => {
      // Arrange — no value

      // Action
      const commentId = CommentId.create();

      // Assert
      expect(commentId.value).toBeTruthy();
      expect(typeof commentId.value).toBe('string');
    });
  });

  describe('equals', () => {
    it('should return true when two CommentId instances have the same value', () => {
      // Arrange
      const commentId1 = CommentId.create('comment-123');
      const commentId2 = CommentId.create('comment-123');

      // Action
      const result = commentId1.equals(commentId2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two CommentId instances have different values', () => {
      // Arrange
      const commentId1 = CommentId.create('comment-123');
      const commentId2 = CommentId.create('comment-456');

      // Action
      const result = commentId1.equals(commentId2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'comment-789';
      const commentId = CommentId.create(value);

      // Action
      const result = commentId.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
