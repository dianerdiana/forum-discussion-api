import request from 'supertest';

import { container } from '@/infrastructures/container/index.js';
import { db } from '@/infrastructures/database/index.js';

import { ThreadsTableTestHelper, UsersTableTestHelper } from '@/tests/index.js';

import { createServer } from '../create-server.js';

describe('Threads Route', () => {
  afterAll(async () => {
    await db.close();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const app = await createServer(container);
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret_pass',
        fullname: 'Dicoding Indonesia',
      });
      const loginResponse = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret_pass',
      });
      const { accessToken } = loginResponse.body.data;

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'A Thread Title', body: 'A thread body content' });

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
      expect(response.body.data.addedThread.id).toBeDefined();
      expect(response.body.data.addedThread.title).toEqual('A Thread Title');
    });

    it('should response 401 when no access token provided', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads')
        .send({ title: 'A Thread Title', body: 'A thread body content' });

      // Assert
      expect(response.status).toEqual(401);
    });

    it('should response 400 when title is not a string', async () => {
      // Arrange
      const app = await createServer(container);
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret_pass',
        fullname: 'Dicoding Indonesia',
      });
      const loginResponse = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret_pass',
      });
      const { accessToken } = loginResponse.body.data;

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 123, body: 'A thread body content' });

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('title harus berupa string');
    });

    it('should response 400 when body is not a string', async () => {
      // Arrange
      const app = await createServer(container);
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret_pass',
        fullname: 'Dicoding Indonesia',
      });
      const loginResponse = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret_pass',
      });
      const { accessToken } = loginResponse.body.data;

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'A Thread Title', body: 456 });

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('body harus berupa string');
    });
  });

  describe('when GET /threads/:threadId', () => {
    it('should response 200 and thread detail', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'A Thread Title',
        body: 'A thread body content',
        owner: 'user-123',
      });
      const app = await createServer(container);

      // Action
      const response = await request(app).get('/threads/thread-123');

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.id).toEqual('thread-123');
      expect(response.body.data.thread.title).toEqual('A Thread Title');
      expect(response.body.data.thread.username).toEqual('dicoding');
      expect(response.body.data.thread.comments).toEqual([]);
    });

    it('should response 404 when threadId does not exist', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).get('/threads/thread-404');

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });
});
