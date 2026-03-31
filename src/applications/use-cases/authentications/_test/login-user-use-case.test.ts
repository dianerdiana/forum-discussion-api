import { vi } from 'vitest';

import type { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager.js';
import type { PasswordHash } from '@/applications/security/password-hash.js';

import type { AuthenticationRepository, UserRepository } from '@/domains/index.js';

import { LoginUserUseCase } from '../login-user.use-case.js';

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const mockedAuthentication = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };
    const mockUserRepository: UserRepository = {
      addUser: vi.fn(),
      existsUsername: vi.fn(),
      getIdByUsername: vi.fn(),
      getPasswordByUsername: vi.fn(),
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
    const mockPasswordHash: PasswordHash = {
      compare: vi.fn(),
      hash: vi.fn(),
    };

    // Mocking
    mockUserRepository.getPasswordByUsername = vi
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.compare = vi.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken));
    mockUserRepository.getIdByUsername = vi
      .fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationRepository.addToken = vi.fn().mockImplementation(() => Promise.resolve());

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith('dicoding');
    expect(mockPasswordHash.compare).toHaveBeenCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({
      username: 'dicoding',
      id: 'user-123',
    });
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({
      username: 'dicoding',
      id: 'user-123',
    });
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(
      mockedAuthentication.refreshToken,
    );
  });
});
