import type { NextFunction, Request, Response } from 'express';
import { vi } from 'vitest';

import type { AuthenticationTokenManager } from '@/applications/index.js';

import { AuthenticationError, TOKENS_CONTAINER } from '@/commons/index.js';

import type { AuthPayload } from '@/domains/index.js';

import { AuthenticationMiddleware } from '../authentication.middleware.js';

describe('AuthenticationMiddleware', () => {
  const mockUser: AuthPayload = { userId: 'user-123', username: 'dicoding' };

  const buildMiddleware = (jwtTokenManager: Partial<AuthenticationTokenManager>) => {
    const mockContainer = {
      getInstance: vi.fn().mockReturnValue(jwtTokenManager),
    };

    return new AuthenticationMiddleware({ container: mockContainer as never });
  };

  const mockRes = {} as Response;
  const mockNext = vi.fn() as NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should set req.user and call next() when token is valid', async () => {
      // Arrange
      const jwtTokenManager: Partial<AuthenticationTokenManager> = {
        verifyAccessToken: vi.fn().mockResolvedValue(undefined),
        decodePayload: vi.fn().mockResolvedValue(mockUser),
      };
      const middleware = buildMiddleware(jwtTokenManager);
      const mockReq = {
        headers: { authorization: 'Bearer valid_token' },
      } as Request;

      // Action
      await middleware.validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(jwtTokenManager.verifyAccessToken).toHaveBeenCalledWith('valid_token');
      expect(jwtTokenManager.decodePayload).toHaveBeenCalledWith('valid_token');
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should use empty string as bearerToken when "Bearer " prefix has no token after it', async () => {
      // Arrange — header is "Bearer " with no token after prefix (split gives undefined at [1])
      const jwtTokenManager: Partial<AuthenticationTokenManager> = {
        verifyAccessToken: vi.fn().mockResolvedValue(undefined),
        decodePayload: vi.fn().mockResolvedValue(mockUser),
      };
      const middleware = buildMiddleware(jwtTokenManager);
      const mockReq = {
        headers: { authorization: 'Bearer ' },
      } as Request;

      // Action
      await middleware.validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(jwtTokenManager.verifyAccessToken).toHaveBeenCalledWith('');
      expect(jwtTokenManager.decodePayload).toHaveBeenCalledWith('');
    });

    it('should throw AuthenticationError when verifyAccessToken throws', async () => {
      // Arrange
      const jwtTokenManager: Partial<AuthenticationTokenManager> = {
        verifyAccessToken: vi.fn().mockRejectedValue(new Error('invalid token')),
        decodePayload: vi.fn(),
      };
      const middleware = buildMiddleware(jwtTokenManager);
      const mockReq = {
        headers: { authorization: 'Bearer invalid_token' },
      } as Request;

      // Action & Assert
      await expect(middleware.validateUser(mockReq, mockRes, mockNext)).rejects.toThrow(
        AuthenticationError,
      );
      expect(jwtTokenManager.decodePayload).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw AuthenticationError when decodePayload throws', async () => {
      // Arrange
      const jwtTokenManager: Partial<AuthenticationTokenManager> = {
        verifyAccessToken: vi.fn().mockResolvedValue(undefined),
        decodePayload: vi.fn().mockRejectedValue(new Error('decode failed')),
      };
      const middleware = buildMiddleware(jwtTokenManager);
      const mockReq = {
        headers: { authorization: 'Bearer valid_token' },
      } as Request;

      // Action & Assert
      await expect(middleware.validateUser(mockReq, mockRes, mockNext)).rejects.toThrow(
        AuthenticationError,
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw AuthenticationError when authorization header is missing', async () => {
      // Arrange
      const jwtTokenManager: Partial<AuthenticationTokenManager> = {
        verifyAccessToken: vi.fn(),
        decodePayload: vi.fn(),
      };
      const middleware = buildMiddleware(jwtTokenManager);
      const mockReq = { headers: {} } as Request;

      // Action & Assert
      await expect(middleware.validateUser(mockReq, mockRes, mockNext)).rejects.toThrow(
        AuthenticationError,
      );
      expect(jwtTokenManager.verifyAccessToken).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw AuthenticationError when authorization header does not contain Bearer', async () => {
      // Arrange
      const jwtTokenManager: Partial<AuthenticationTokenManager> = {
        verifyAccessToken: vi.fn(),
        decodePayload: vi.fn(),
      };
      const middleware = buildMiddleware(jwtTokenManager);
      const mockReq = {
        headers: { authorization: 'Basic dXNlcjpwYXNz' },
      } as Request;

      // Action & Assert
      await expect(middleware.validateUser(mockReq, mockRes, mockNext)).rejects.toThrow(
        AuthenticationError,
      );
      expect(jwtTokenManager.verifyAccessToken).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should get jwtTokenManager from container using correct token key', async () => {
      // Arrange
      const jwtTokenManager: Partial<AuthenticationTokenManager> = {
        verifyAccessToken: vi.fn().mockResolvedValue(undefined),
        decodePayload: vi.fn().mockResolvedValue(mockUser),
      };
      const mockContainer = {
        getInstance: vi.fn().mockReturnValue(jwtTokenManager),
      };
      const middleware = new AuthenticationMiddleware({ container: mockContainer as never });
      const mockReq = {
        headers: { authorization: 'Bearer valid_token' },
      } as Request;

      // Action
      await middleware.validateUser(mockReq, mockRes, mockNext);

      // Assert
      expect(mockContainer.getInstance).toHaveBeenCalledWith(
        TOKENS_CONTAINER.authenticationTokenManager,
      );
    });
  });
});
