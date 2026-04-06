import { NotFoundError } from '@/commons/index.js';

import { Thread, ThreadId } from '@/domains/index.js';

import { db } from '@/infrastructures/database/index.js';

import { ThreadsTableTestHelper, UsersTableTestHelper } from '@/tests/index.js';

import { PostgresThreadRepository } from '../postgres-thread.repository.js';

describe('PostgresThreadRepository', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('save', () => {
    it('should persist a new thread into database', async () => {
      // Arrange
      const threadRepository = new PostgresThreadRepository(db);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const newThread = Thread.create({
        id: 'thread-123',
        title: 'A Thread Title',
        body: 'A thread body content',
        owner: 'user-123',
      });

      // Action
      const result = await threadRepository.save(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(threads[0]).toMatchObject({
        id: 'thread-123',
        title: 'A Thread Title',
        body: 'A thread body content',
        owner: 'user-123',
      });
      expect(result.id.value).toBe('thread-123');
      expect(result.title.value).toBe('A Thread Title');
      expect(result.body.value).toBe('A thread body content');
      expect(result.owner.value).toBe('user-123');
    });

    it('should update thread when id already exists', async () => {
      // Arrange
      const threadRepository = new PostgresThreadRepository(db);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Old Title',
        body: 'Old body',
        owner: 'user-123',
      });
      const updatedThread = Thread.create({
        id: 'thread-123',
        title: 'New Title',
        body: 'New body',
        owner: 'user-123',
      });

      // Action
      const result = await threadRepository.save(updatedThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(threads[0]).toMatchObject({
        id: 'thread-123',
        title: 'New Title',
        body: 'New body',
        owner: 'user-123',
      });
      expect(result.id.value).toBe('thread-123');
      expect(result.title.value).toBe('New Title');
      expect(result.body.value).toBe('New body');
      expect(result.owner.value).toBe('user-123');
    });
  });

  describe('findById', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepository = new PostgresThreadRepository(db);

      // Action & Assert
      await expect(threadRepository.findById(ThreadId.create('thread-404'))).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should return thread entity when thread is found', async () => {
      // Arrange
      const threadRepository = new PostgresThreadRepository(db);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'A Thread Title',
        body: 'A thread body content',
        owner: 'user-123',
      });

      // Action
      const result = await threadRepository.findById(ThreadId.create('thread-123'));

      // Assert
      expect(result.id.value).toBe('thread-123');
      expect(result.title.value).toBe('A Thread Title');
      expect(result.body.value).toBe('A thread body content');
      expect(result.owner.value).toBe('user-123');
    });
  });
});
