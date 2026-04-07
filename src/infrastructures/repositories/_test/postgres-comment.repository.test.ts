import { InvariantError, NotFoundError } from '@/commons/index.js';

import { Comment, CommentId, ThreadId } from '@/domains/index.js';

import { db } from '@/infrastructures/database/index.js';

import {
  CommentsTableTestHelper,
  ThreadsTableTestHelper,
  UsersTableTestHelper,
} from '@/tests/index.js';

import { PostgresCommentRepository } from '../postgres-comment.repository.js';

describe('PostgresCommentRepository', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('save', () => {
    it('should persist a new comment into database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const commentRepository = new PostgresCommentRepository(db);
      const newComment = Comment.create({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'A comment content',
        owner: 'user-123',
      });

      // Action
      const result = await commentRepository.save(newComment);

      // Assert
      const rows = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        id: 'comment-123',
        content: 'A comment content',
        owner: 'user-123',
      });
      expect(result.id.value).toBe('comment-123');
      expect(result.content.value).toBe('A comment content');
      expect(result.threadId.value).toBe('thread-123');
    });

    it('should persist a reply comment with parentId', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepository = new PostgresCommentRepository(db);
      const replyComment = Comment.create({
        id: 'comment-reply-1',
        threadId: 'thread-123',
        parentId: 'comment-123',
        content: 'A reply',
        owner: 'user-123',
      });

      // Action
      const result = await commentRepository.save(replyComment);

      // Assert
      const rows = await CommentsTableTestHelper.findCommentById('comment-reply-1');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ id: 'comment-reply-1', content: 'A reply' });
      expect(result.parentId?.value).toBe('comment-123');
    });

    it('should update comment when id already exists (upsert)', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'Old content',
      });
      const commentRepository = new PostgresCommentRepository(db);
      const updatedComment = Comment.create({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'Updated content',
        owner: 'user-123',
      });

      // Action
      const result = await commentRepository.save(updatedComment);

      // Assert
      const rows = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ id: 'comment-123', content: 'Updated content' });
      expect(result.content.value).toBe('Updated content');
    });

    it('should throw InvariantError when database returns no rows', async () => {
      // Arrange
      const commentRepository = new PostgresCommentRepository(db);
      const newComment = Comment.create({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'A comment content',
        owner: 'user-123',
      });

      vi.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: [],
      });

      // Action & Assert
      await expect(commentRepository.save(newComment)).rejects.toThrow(InvariantError);
    });
  });

  describe('findThreadComments', () => {
    it('should return empty array when no comments exist for the thread', async () => {
      // Arrange
      const commentRepository = new PostgresCommentRepository(db);

      // Action
      const result = await commentRepository.findThreadComments(ThreadId.create('thread-404'));

      // Assert
      expect(result).toStrictEqual([]);
    });

    it('should return all comments that belong to the thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-456', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-other', threadId: 'thread-456' });
      const commentRepository = new PostgresCommentRepository(db);

      // Action
      const result = await commentRepository.findThreadComments(ThreadId.create('thread-123'));

      // Assert
      expect(result).toHaveLength(2);
      const ids = result.map((c) => c.id.value);
      expect(ids).toContain('comment-1');
      expect(ids).toContain('comment-2');
    });

    it('should include soft-deleted comments in the result', async () => {
      // Arrange
      const commentRepository = new PostgresCommentRepository(db);
      const comment = Comment.create({
        id: 'comment-deleted',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'Deleted',
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', content: 'Visible' });
      await commentRepository.save(comment);
      await commentRepository.delete(comment.id);

      // Action
      const result = await commentRepository.findThreadComments(ThreadId.create('thread-123'));

      // Assert
      expect(result).toHaveLength(2);
      const deletedComment = result.find((c) => c.id.value === 'comment-deleted');

      expect(deletedComment?.deletedAt).not.toBeNull();
    });

    it('should return Comment entities with correct properties', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'Hello world',
      });
      const commentRepository = new PostgresCommentRepository(db);

      // Action
      const result = await commentRepository.findThreadComments(ThreadId.create('thread-123'));

      // Assert
      expect(result).toHaveLength(1);
      const comment = result[0]!;
      expect(comment.id.value).toBe('comment-1');
      expect(comment.threadId.value).toBe('thread-123');
      expect(comment.owner.value).toBe('user-123');
      expect(comment.content.value).toBe('Hello world');
      expect(comment.deletedAt).toBeNull();
    });

    it('should return comments ordered by created_at ascending', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await db.query({
        text: `INSERT INTO comments (id, thread_id, owner, content, created_at)
               VALUES ($1, $2, $3, $4, $5)`,
        values: ['comment-newest', 'thread-123', 'user-123', 'Newest', new Date('2025-01-03')],
      });
      await db.query({
        text: `INSERT INTO comments (id, thread_id, owner, content, created_at)
               VALUES ($1, $2, $3, $4, $5)`,
        values: ['comment-oldest', 'thread-123', 'user-123', 'Oldest', new Date('2025-01-01')],
      });
      await db.query({
        text: `INSERT INTO comments (id, thread_id, owner, content, created_at)
               VALUES ($1, $2, $3, $4, $5)`,
        values: ['comment-middle', 'thread-123', 'user-123', 'Middle', new Date('2025-01-02')],
      });
      const commentRepository = new PostgresCommentRepository(db);

      // Action
      const result = await commentRepository.findThreadComments(ThreadId.create('thread-123'));

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]!.id.value).toBe('comment-oldest');
      expect(result[1]!.id.value).toBe('comment-middle');
      expect(result[2]!.id.value).toBe('comment-newest');
    });
  });

  describe('findById', () => {
    it('should return a Comment entity when the id exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'A comment content',
      });
      const commentRepository = new PostgresCommentRepository(db);

      // Action
      const result = await commentRepository.findById(CommentId.create('comment-123'));

      // Assert
      expect(result.id.value).toBe('comment-123');
      expect(result.threadId.value).toBe('thread-123');
      expect(result.owner.value).toBe('user-123');
      expect(result.content.value).toBe('A comment content');
      expect(result.deletedAt).toBeNull();
    });

    it('should throw NotFoundError when the id does not exist', async () => {
      // Arrange
      const commentRepository = new PostgresCommentRepository(db);

      // Action
      const action = () => commentRepository.findById(CommentId.create('comment-404'));

      // Assert
      await expect(action()).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should soft delete the comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepository = new PostgresCommentRepository(db);

      // Action
      await commentRepository.delete(CommentId.create('comment-123'));

      // Assert
      const rows = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(rows).toHaveLength(1);
    });
  });
});
