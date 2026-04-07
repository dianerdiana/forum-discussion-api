import jwt from 'jsonwebtoken';
import { describe, expect, it, vi } from 'vitest';

import config from '@/commons/config.js';
import { InvariantError } from '@/commons/index.js';

import type { JwtAdapter } from '../jwt-adapter.js';
import { JwtTokenManager } from '../jwt-token-manager.js';

describe('JwtTokenManager', () => {
  describe('createAccessToken', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        username: 'dicoding',
      };
      const mockJwtToken: JwtAdapter = {
        sign: vi.fn().mockReturnValue('mock_token'),
        decode: vi.fn(),
        verify: vi.fn(),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(mockJwtToken.sign).toHaveBeenCalledWith(payload, config.auth.accessTokenKey);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        username: 'dicoding',
      };
      const mockJwtToken: JwtAdapter = {
        sign: vi.fn().mockReturnValue('mock_token'),
        decode: vi.fn(),
        verify: vi.fn(),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(mockJwtToken.sign).toHaveBeenCalledWith(payload, config.auth.refreshTokenKey);
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({
        userId: 'user-123',
        username: 'dicoding',
      });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        userId: 'user-123',
        username: 'dicoding',
      });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow(
        InvariantError,
      );
    });
  });

  describe('verifyAccessToken', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        userId: 'user-123',
        username: 'dicoding',
      });

      // Action & Assert
      await expect(jwtTokenManager.verifyAccessToken(refreshToken)).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when access token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({
        userId: 'user-123',
        username: 'dicoding',
      });

      // Action & Assert
      await expect(jwtTokenManager.verifyAccessToken(accessToken)).resolves.not.toThrow(
        InvariantError,
      );
    });
  });

  describe('decodePayload', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({
        userId: 'user-123',
        username: 'dicoding',
      });

      // Action
      const payload = await jwtTokenManager.decodePayload(accessToken);

      // Assert
      expect(payload).toStrictEqual({
        userId: 'user-123',
        username: 'dicoding',
      });
    });

    it('should throw InvariantError when payload is not valid object', async () => {
      // Arrange
      const mockJwtToken: JwtAdapter = {
        sign: vi.fn(),
        decode: vi.fn().mockReturnValue('invalid_payload'),
        verify: vi.fn(),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action & Assert
      await expect(jwtTokenManager.decodePayload('token')).rejects.toThrow(InvariantError);
    });

    it('should throw InvariantError when payload misses required fields', async () => {
      // Arrange
      const mockJwtToken: JwtAdapter = {
        sign: vi.fn(),
        decode: vi.fn().mockReturnValue({ username: 'dicoding' }),
        verify: vi.fn(),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action & Assert
      await expect(jwtTokenManager.decodePayload('token')).rejects.toThrow(InvariantError);
    });
  });
});
