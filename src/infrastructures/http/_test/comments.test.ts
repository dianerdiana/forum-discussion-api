import request from 'supertest';

import { TOKENS_CONTAINER } from '@/commons/index.js';

import { container } from '@/infrastructures/container/index.js';
import { db } from '@/infrastructures/database/index.js';

import {
  CommentsTableTestHelper,
  ThreadsTableTestHelper,
  UsersTableTestHelper,
} from '@/tests/index.js';

import { createServer } from '../create-server.js';

describe('Comments Route', () => {
  afterAll(async () => {
    await db.close();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/:threadId/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const accessToken = await container
        .getInstance(TOKENS_CONTAINER.authenticationTokenManager)
        .createAccessToken({ userId: 'user-123', username: 'dicoding' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'A comment content' });

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
      expect(response.body.data.addedComment.id).toBeDefined();
    });

    it('should response 401 when no access token provided', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads/thread-123/comments')
        .send({ content: 'A comment content' });

      // Assert
      expect(response.status).toEqual(401);
    });

    it('should response 400 when content is not a string', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const accessToken = await container
        .getInstance(TOKENS_CONTAINER.authenticationTokenManager)
        .createAccessToken({ userId: 'user-123', username: 'dicoding' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 123 });

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('content harus berupa string');
    });

    it('should response 404 when threadId does not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const accessToken = await container
        .getInstance(TOKENS_CONTAINER.authenticationTokenManager)
        .createAccessToken({ userId: 'user-123', username: 'dicoding' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads/thread-404/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'A comment content' });

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('when DELETE /threads/:threadId/comments/:commentId', () => {
    it('should response 200 when comment deleted successfully', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const accessToken = await container
        .getInstance(TOKENS_CONTAINER.authenticationTokenManager)
        .createAccessToken({ userId: 'user-123', username: 'dicoding' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.message).toEqual('berhasil menghapus komentar');
    });

    it('should response 401 when no access token provided', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).delete('/threads/thread-123/comments/comment-123');

      // Assert
      expect(response.status).toEqual(401);
    });

    it('should response 403 when user is not the comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'other-user-id', username: 'other_user' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const accessToken = await container
        .getInstance(TOKENS_CONTAINER.authenticationTokenManager)
        .createAccessToken({ userId: 'other-user-id', username: 'other_user' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when commentId does not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const accessToken = await container
        .getInstance(TOKENS_CONTAINER.authenticationTokenManager)
        .createAccessToken({ userId: 'user-123', username: 'dicoding' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-404')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });
});
