/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';

import { TOKENS_CONTAINER } from '@/commons/index.js';

import { container } from '@/infrastructures/container/index.js';
import { db } from '@/infrastructures/database/index.js';

import { AuthenticationsTableTestHelper, UsersTableTestHelper } from '@/tests/index.js';

import { createServer } from '../create-server.js';

describe('HTTP server', () => {
  afterAll(async () => {
    await db.close();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const app = await createServer(container);

    // Action
    const response = await request(app).get('/unregisteredRoute');

    // Assert
    expect(response.status).toEqual(404);
  });

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding_auth',
        password: 'secret_pass_auth',
      };
      const app = await createServer(container);

      // Action
      await request(app).post('/users').send({
        username: 'dicoding_auth',
        password: 'secret_pass_auth',
        fullname: 'Dicoding Indonesia',
      });

      const response = await request(app).post('/authentications').send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret_pass',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/authentications').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('kredensial yang Anda masukkan salah');
    });

    it('should response 401 if password wrong', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'wrong_password',
      };
      const app = await createServer(container);

      // Action
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret_pass',
        fullname: 'Dicoding Indonesia',
      });

      const response = await request(app).post('/authentications').send(requestPayload);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('kredensial yang Anda masukkan salah');
    });

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/authentications').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username and password tidak boleh kosong');
    });
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
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

      const { refreshToken } = loginResponse.body.data;
      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      const app = await createServer(container);

      const response = await request(app).put('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak boleh kosong');
    });

    it('should return 400 if refresh token not string', async () => {
      const app = await createServer(container);

      const response = await request(app).put('/authentications').send({ refreshToken: 123 });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token harus berupa string');
    });

    it('should return 400 if refresh token not valid', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .put('/authentications')
        .send({ refreshToken: 'invalid_refresh_token' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('invalid refresh token');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const refreshToken = await container
        .getInstance(TOKENS_CONTAINER.authenticationTokenManager)
        .createRefreshToken({ username: 'dicoding' });

      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak terdaftar di database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      const response = await request(app).delete('/authentications').send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';

      const response = await request(app).delete('/authentications').send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak terdaftar di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      const app = await createServer(container);

      const response = await request(app).delete('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak boleh kosong');
    });
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const fakeContainer = {} as any;
    const app = await createServer(fakeContainer);

    // Action
    const response = await request(app).post('/users').send(requestPayload);

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
  });
});
