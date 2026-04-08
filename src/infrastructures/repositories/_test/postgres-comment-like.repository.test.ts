/* eslint-disable camelcase */
import { vi } from 'vitest';

import { InvariantError } from '@/commons/index.js';

import { CommentId, CommentLike, ThreadId, UserId } from '@/domains/index.js';

import { db } from '@/infrastructures/database/index.js';

import {
  CommentLikesTableTestHelper,
  CommentsTableTestHelper,
  ThreadsTableTestHelper,
  UsersTableTestHelper,
} from '@/tests/index.js';

import { PostgresCommentLikeRepository } from '../postgres-comment-like.repository.js';

describe('PostgresCommentLikeRepository', () => {
  beforeEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('save', () => {
    it('should persist a new CommentLike into the database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const repository = new PostgresCommentLikeRepository(db);
      const newLike = CommentLike.create({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Action
      const result = await repository.save(newLike);

      // Assert
      const rows = await CommentLikesTableTestHelper.findCommentLikeById('like-123');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        id: 'like-123',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
        user_id: 'user-123',
      });
      expect(result).toBeInstanceOf(CommentLike);
      expect(result.id.value).toBe('like-123');
      expect(result.threadId.value).toBe('thread-123');
      expect(result.commentId.value).toBe('comment-123');
      expect(result.userId.value).toBe('user-123');
    });

    it('should throw InvariantError when database returns no rows', async () => {
      // Arrange
      const repository = new PostgresCommentLikeRepository(db);
      const newLike = CommentLike.create({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      vi.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: [],
      });

      // Action & Assert
      await expect(repository.save(newLike)).rejects.toThrow(InvariantError);
    });
  });

  describe('findOne', () => {
    it('should return null when no matching CommentLike exists', async () => {
      // Arrange
      const repository = new PostgresCommentLikeRepository(db);

      // Action
      const result = await repository.findOne({
        threadId: ThreadId.create('thread-123'),
        commentId: CommentId.create('comment-123'),
        userId: UserId.create('user-123'),
      });

      // Assert
      expect(result).toBeNull();
    });

    it('should return CommentLike when a matching record exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      const repository = new PostgresCommentLikeRepository(db);

      // Action
      const result = await repository.findOne({
        threadId: ThreadId.create('thread-123'),
        commentId: CommentId.create('comment-123'),
        userId: UserId.create('user-123'),
      });

      // Assert
      expect(result).toBeInstanceOf(CommentLike);
      expect(result!.id.value).toBe('like-123');
      expect(result!.threadId.value).toBe('thread-123');
      expect(result!.commentId.value).toBe('comment-123');
      expect(result!.userId.value).toBe('user-123');
    });

    it('should return null when threadId, commentId, or userId does not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      const repository = new PostgresCommentLikeRepository(db);

      // Action
      const result = await repository.findOne({
        threadId: ThreadId.create('thread-other'),
        commentId: CommentId.create('comment-123'),
        userId: UserId.create('user-123'),
      });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findThreadCommentLikes', () => {
    it('should return empty array when no likes exist for the thread', async () => {
      // Arrange
      const repository = new PostgresCommentLikeRepository(db);

      // Action
      const result = await repository.findThreadCommentLikes(ThreadId.create('thread-404'));

      // Assert
      expect(result).toStrictEqual([]);
    });

    it('should return all CommentLikes that belong to the thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'another' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-other', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-other', threadId: 'thread-other' });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-1',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-2',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-456',
      });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-other',
        threadId: 'thread-other',
        commentId: 'comment-other',
        userId: 'user-123',
      });
      const repository = new PostgresCommentLikeRepository(db);

      // Action
      const result = await repository.findThreadCommentLikes(ThreadId.create('thread-123'));

      // Assert
      expect(result).toHaveLength(2);
      const ids = result.map((l) => l.id.value);
      expect(ids).toContain('like-1');
      expect(ids).toContain('like-2');
    });

    it('should return CommentLike entities with correct properties', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      const repository = new PostgresCommentLikeRepository(db);

      // Action
      const result = await repository.findThreadCommentLikes(ThreadId.create('thread-123'));

      // Assert
      expect(result).toHaveLength(1);
      const like = result[0]!;
      expect(like).toBeInstanceOf(CommentLike);
      expect(like.threadId.value).toBe('thread-123');
      expect(like.commentId.value).toBe('comment-123');
      expect(like.userId.value).toBe('user-123');
      expect(like.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('delete', () => {
    it('should remove the CommentLike from the database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      const repository = new PostgresCommentLikeRepository(db);

      // Action
      await repository.delete({
        threadId: ThreadId.create('thread-123'),
        commentId: CommentId.create('comment-123'),
        userId: UserId.create('user-123'),
      });

      // Assert
      const rows = await CommentLikesTableTestHelper.findCommentLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      expect(rows).toHaveLength(0);
    });

    it('should not affect other likes when deleting a specific one', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'another' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-456',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-456',
      });
      const repository = new PostgresCommentLikeRepository(db);

      // Action
      await repository.delete({
        threadId: ThreadId.create('thread-123'),
        commentId: CommentId.create('comment-123'),
        userId: UserId.create('user-123'),
      });

      // Assert
      const remaining = await CommentLikesTableTestHelper.findCommentLikeById('like-456');
      expect(remaining).toHaveLength(1);

      const deleted = await CommentLikesTableTestHelper.findCommentLikeById('like-123');
      expect(deleted).toHaveLength(0);
    });
  });
});
