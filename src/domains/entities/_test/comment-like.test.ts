import { CommentId, CommentLikeId, ThreadId, UserId } from '@/domains/value-objects/index.js';

import { CommentLike } from '../comment-like.js';

describe('CommentLike', () => {
  describe('create', () => {
    it('should create a CommentLike entity with required fields', () => {
      // Arrange
      const props = {
        threadId: 'thread-123',
        commentId: 'comment-456',
        userId: 'user-123',
      };

      // Action
      const commentLike = CommentLike.create(props);

      // Assert
      expect(commentLike).toBeInstanceOf(CommentLike);
      expect(commentLike.id).toBeInstanceOf(CommentLikeId);
      expect(commentLike.threadId).toBeInstanceOf(ThreadId);
      expect(commentLike.threadId.value).toBe(props.threadId);
      expect(commentLike.commentId).toBeInstanceOf(CommentId);
      expect(commentLike.commentId.value).toBe(props.commentId);
      expect(commentLike.userId).toBeInstanceOf(UserId);
      expect(commentLike.userId.value).toBe(props.userId);
      expect(commentLike.createdAt).toBeInstanceOf(Date);
    });

    it('should use provided id when given', () => {
      // Arrange
      const props = {
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-456',
        userId: 'user-123',
      };

      // Action
      const commentLike = CommentLike.create(props);

      // Assert
      expect(commentLike.id.value).toBe('like-123');
    });

    it('should create a CommentLike entity with the given commentId', () => {
      // Arrange
      const props = {
        threadId: 'thread-123',
        userId: 'user-123',
        commentId: 'comment-456',
      };

      // Action
      const commentLike = CommentLike.create(props);

      // Assert
      expect(commentLike.commentId).toBeInstanceOf(CommentId);
      expect(commentLike.commentId.value).toBe(props.commentId);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a CommentLike entity from persistence data', () => {
      // Arrange
      const createdAt = new Date('2026-04-06T00:00:00.000Z');
      const props = {
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-456',
        userId: 'user-123',
        createdAt,
      };

      // Action
      const commentLike = CommentLike.reconstitute(props);

      // Assert
      expect(commentLike).toBeInstanceOf(CommentLike);
      expect(commentLike.id).toBeInstanceOf(CommentLikeId);
      expect(commentLike.id.value).toBe(props.id);
      expect(commentLike.threadId.value).toBe(props.threadId);
      expect(commentLike.commentId).toBeInstanceOf(CommentId);
      expect(commentLike.commentId?.value).toBe(props.commentId);
      expect(commentLike.userId.value).toBe(props.userId);
      expect(commentLike.createdAt).toBe(createdAt);
    });
  });

  describe('toPersistence', () => {
    it('should return a plain object with all fields', () => {
      // Arrange
      const createdAt = new Date('2026-04-06T00:00:00.000Z');
      const commentLike = CommentLike.reconstitute({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-456',
        userId: 'user-123',
        createdAt,
      });

      // Action
      const result = commentLike.toPersistence();

      // Assert
      expect(result).toStrictEqual({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-456',
        userId: 'user-123',
        createdAt,
      });
    });
  });
});
