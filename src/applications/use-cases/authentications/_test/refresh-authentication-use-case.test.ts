/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

import type { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager.js';

import type { AuthenticationRepository } from '@/domains/index.js';

import { RefreshAuthenticationUseCase } from '../refresh-authentication.use-case.js';

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {} as any;
    const authenticationRepository: AuthenticationRepository = {
      addToken: vi.fn(),
      deleteToken: vi.fn(),
      existsToken: vi.fn(),
    };
    const authenticationTokenManager: AuthenticationTokenManager = {
      createAccessToken: vi.fn(),
      createRefreshToken: vi.fn(),
      decodePayload: vi.fn(),
      verifyRefreshToken: vi.fn(),
    };
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository,
      authenticationTokenManager,
    });

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrow(
      'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
    );
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 1,
    } as any;
    const authenticationRepository: AuthenticationRepository = {
      addToken: vi.fn(),
      deleteToken: vi.fn(),
      existsToken: vi.fn(),
    };
    const authenticationTokenManager: AuthenticationTokenManager = {
      createAccessToken: vi.fn(),
      createRefreshToken: vi.fn(),
      decodePayload: vi.fn(),
      verifyRefreshToken: vi.fn(),
    };
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository,
      authenticationTokenManager,
    });

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrow(
      'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token',
    };
    const mockAuthenticationRepository: AuthenticationRepository = {
      addToken: vi.fn(),
      deleteToken: vi.fn(),
      existsToken: vi.fn(),
    };
    const mockAuthenticationTokenManager: AuthenticationTokenManager = {
      createAccessToken: vi.fn(),
      createRefreshToken: vi.fn(),
      decodePayload: vi.fn(),
      verifyRefreshToken: vi.fn(),
    };
    // Mocking
    mockAuthenticationRepository.existsToken = vi.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyRefreshToken = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = vi
      .fn()
      .mockImplementation(() => Promise.resolve({ username: 'dicoding', id: 'user-123' }));
    mockAuthenticationTokenManager.createAccessToken = vi
      .fn()
      .mockImplementation(() => Promise.resolve('some_new_access_token'));
    // Create the use case instace
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
    expect(mockAuthenticationRepository.existsToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({
      username: 'dicoding',
      id: 'user-123',
    });
    expect(accessToken).toEqual('some_new_access_token');
  });
});
