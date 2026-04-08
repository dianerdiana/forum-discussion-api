import { DomainError } from '@/domains/commons/index.js';

import { CommentLikeId } from '../comment-like-id.value-object.js';

describe('CommentLikeId', () => {
  describe('constructor', () => {
    it('should create a CommentLikeId with a provided value', () => {
      // Arrange
      const value = 'comment-123';

      // Action
      const commentLikeId = new CommentLikeId(value);

      // Assert
      expect(commentLikeId).toBeInstanceOf(CommentLikeId);
      expect(commentLikeId.value).toBe(value);
    });

    it('should generate a UUID when no value is provided', () => {
      // Arrange — no value

      // Action
      const commentLikeId = new CommentLikeId();

      // Assert
      expect(commentLikeId.value).toBeTruthy();
      expect(typeof commentLikeId.value).toBe('string');
    });

    it('should throw DomainError when value is empty string', () => {
      // Arrange
      const value = '';

      // Action & Assert
      expect(() => new CommentLikeId(value)).toThrow(DomainError);
    });

    it('should throw DomainError when value is whitespace only', () => {
      // Arrange
      const value = '   ';

      // Action & Assert
      expect(() => new CommentLikeId(value)).toThrow(DomainError);
    });
  });

  describe('create', () => {
    it('should create a CommentLikeId with a provided value via static factory method', () => {
      // Arrange
      const value = 'comment-456';

      // Action
      const commentLikeId = CommentLikeId.create(value);

      // Assert
      expect(commentLikeId).toBeInstanceOf(CommentLikeId);
      expect(commentLikeId.value).toBe(value);
    });

    it('should generate a UUID when no value is provided via static factory method', () => {
      // Arrange — no value

      // Action
      const commentLikeId = CommentLikeId.create();

      // Assert
      expect(commentLikeId.value).toBeTruthy();
      expect(typeof commentLikeId.value).toBe('string');
    });
  });

  describe('equals', () => {
    it('should return true when two CommentLikeId instances have the same value', () => {
      // Arrange
      const commentLikeId1 = CommentLikeId.create('comment-123');
      const commentLikeId2 = CommentLikeId.create('comment-123');

      // Action
      const result = commentLikeId1.equals(commentLikeId2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when two CommentLikeId instances have different values', () => {
      // Arrange
      const commentLikeId1 = CommentLikeId.create('comment-123');
      const commentLikeId2 = CommentLikeId.create('comment-456');

      // Action
      const result = commentLikeId1.equals(commentLikeId2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      // Arrange
      const value = 'comment-789';
      const commentLikeId = CommentLikeId.create(value);

      // Action
      const result = commentLikeId.toString();

      // Assert
      expect(result).toBe(value);
    });
  });
});
