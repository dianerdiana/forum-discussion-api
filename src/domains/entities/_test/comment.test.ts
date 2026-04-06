import { DomainError } from '@/domains/commons/index.js';
import { CommentContent, CommentId, ThreadId, UserId } from '@/domains/value-objects/index.js';

import { Comment } from '../comment.js';

describe('Comment', () => {
  describe('create', () => {
    it('should create a Comment entity with required fields', () => {
      // Arrange
      const props = {
        threadId: 'thread-123',
        content: 'A comment content',
        owner: 'user-123',
      };

      // Action
      const comment = Comment.create(props);

      // Assert
      expect(comment).toBeInstanceOf(Comment);
      expect(comment.id).toBeInstanceOf(CommentId);
      expect(comment.threadId).toBeInstanceOf(ThreadId);
      expect(comment.threadId.value).toBe(props.threadId);
      expect(comment.owner).toBeInstanceOf(UserId);
      expect(comment.owner.value).toBe(props.owner);
      expect(comment.content).toBeInstanceOf(CommentContent);
      expect(comment.content.value).toBe(props.content);
      expect(comment.parentId).toBeNull();
      expect(comment.deletedAt).toBeNull();
      expect(comment.createdAt).toBeInstanceOf(Date);
    });

    it('should create a Comment entity with a parentId when provided', () => {
      // Arrange
      const props = {
        threadId: 'thread-123',
        content: 'A reply comment',
        owner: 'user-123',
        parentId: 'comment-456',
      };

      // Action
      const comment = Comment.create(props);

      // Assert
      expect(comment.parentId).toBeInstanceOf(CommentId);
      expect(comment.parentId?.value).toBe(props.parentId);
    });

    it('should throw DomainError when content is empty', () => {
      // Arrange
      const props = {
        threadId: 'thread-123',
        content: '',
        owner: 'user-123',
      };

      // Action & Assert
      expect(() => Comment.create(props)).toThrow(DomainError);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a Comment entity from persistence data', () => {
      // Arrange
      const createdAt = new Date('2026-04-06T00:00:00.000Z');
      const props = {
        id: 'comment-123',
        threadId: 'thread-123',
        parentId: '',
        content: 'A comment content',
        owner: 'user-123',
        createdAt,
        deletedAt: null,
      };

      // Action
      const comment = Comment.reconstitute(props);

      console.log(comment.toPersistance());

      // Assert
      expect(comment).toBeInstanceOf(Comment);
      expect(comment.id).toBeInstanceOf(CommentId);
      expect(comment.id.value).toBe(props.id);
      expect(comment.threadId.value).toBe(props.threadId);
      expect(comment.parentId).toBeNull();
      expect(comment.owner.value).toBe(props.owner);
      expect(comment.content.value).toBe(props.content);
      expect(comment.createdAt).toBe(createdAt);
      expect(comment.deletedAt).toBeNull();
    });

    it('should reconstitute with deletedAt when comment is deleted', () => {
      // Arrange
      const deletedAt = new Date('2026-04-06T00:00:00.000Z');
      const props = {
        id: 'comment-123',
        threadId: 'thread-123',
        parentId: '',
        content: 'A deleted comment',
        owner: 'user-123',
        createdAt: new Date('2026-04-06T00:00:00.000Z'),
        deletedAt,
      };

      // Action
      const comment = Comment.reconstitute(props);

      // Assert
      expect(comment.deletedAt).toBe(deletedAt);
    });
  });

  describe('toPersistance', () => {
    it('should return a plain object with all fields', () => {
      // Arrange
      const createdAt = new Date('2026-04-06T00:00:00.000Z');
      const comment = Comment.reconstitute({
        id: 'comment-123',
        threadId: 'thread-123',
        parentId: '',
        content: 'A comment content',
        owner: 'user-123',
        createdAt,
        deletedAt: null,
      });

      // Action
      const result = comment.toPersistance();

      // Assert
      expect(result).toStrictEqual({
        id: 'comment-123',
        threadId: 'thread-123',
        parentId: null,
        content: 'A comment content',
        owner: 'user-123',
        createdAt,
        deletedAt: null,
      });
    });
  });
});
