import request from 'supertest';

import { TOKENS_CONTAINER } from '@/commons/index.js';

import { container } from '@/infrastructures/container/index.js';
import { db } from '@/infrastructures/database/index.js';

import {
  CommentLikesTableTestHelper,
  CommentsTableTestHelper,
  ThreadsTableTestHelper,
  UsersTableTestHelper,
} from '@/tests/index.js';

import { createServer } from '../create-server.js';

describe('Comment Likes Route', () => {
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

  describe('when PUT /threads/:threadId/comments/:commentId/likes', () => {
    it('should response 200 when liking a comment for the first time', async () => {
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
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');

      const rows = await CommentLikesTableTestHelper.findCommentLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      expect(rows).toHaveLength(1);
    });

    it('should response 200 and remove like when toggling (unliking)', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      const accessToken = await container
        .getInstance(TOKENS_CONTAINER.authenticationTokenManager)
        .createAccessToken({ userId: 'user-123', username: 'dicoding' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');

      const rows = await CommentLikesTableTestHelper.findCommentLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      expect(rows).toHaveLength(0);
    });

    it('should response 401 when no access token provided', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).put('/threads/thread-123/comments/comment-123/likes');

      // Assert
      expect(response.status).toEqual(401);
    });

    it('should response 404 when threadId does not exist', async () => {
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
        .put('/threads/thread-404/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
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
        .put('/threads/thread-123/comments/comment-404/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when userId does not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      // Token dibuat untuk user yang tidak ada di database
      const accessToken = await container
        .getInstance(TOKENS_CONTAINER.authenticationTokenManager)
        .createAccessToken({ userId: 'user-404', username: 'ghost' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });
});
