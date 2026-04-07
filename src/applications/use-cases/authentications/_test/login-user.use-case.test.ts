import { vi } from 'vitest';

import type { AuthenticationTokenManager, PasswordHash } from '@/applications/security/index.js';

import {
  Authentication,
  type AuthenticationRepository,
  DomainError,
  User,
  Username,
  type UserRepository,
} from '@/domains/index.js';

import { LoginUserUseCase } from '../login-user.use-case.js';

describe('LoginUserUseCase', () => {
  it('should orchestrating the login action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret_pass',
    };

    const user = User.create({
      id: 'user-123',
      username: 'dicoding',
      password: 'hashed_password',
      fullname: 'Dicoding Indonesia',
    });

    const mockedAuthentication = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    const authentication = Authentication.create({ token: mockedAuthentication.refreshToken });

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findById: vi.fn(),
      findByUsername: vi.fn().mockResolvedValue(user),
      findByIds: vi.fn(),
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn().mockResolvedValue(authentication),
      deleteToken: vi.fn(),
      existsByToken: vi.fn(),
    };

    const mockAuthenticationTokenManager: AuthenticationTokenManager = {
      createAccessToken: vi.fn().mockResolvedValue(mockedAuthentication.accessToken),
      createRefreshToken: vi.fn().mockResolvedValue(mockedAuthentication.refreshToken),
      decodePayload: vi.fn(),
      verifyRefreshToken: vi.fn(),
      verifyAccessToken: vi.fn(),
    };
    const mockPasswordHash: PasswordHash = {
      compare: vi.fn().mockResolvedValue(true),
      hash: vi.fn(),
    };

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
    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(Username.create('dicoding'));
    expect(mockPasswordHash.compare).toHaveBeenCalledWith('secret_pass', 'hashed_password');
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({
      userId: 'user-123',
      username: 'dicoding',
    });
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({
      userId: 'user-123',
      username: 'dicoding',
    });
    expect(mockAuthenticationRepository.save).toHaveBeenCalledWith(
      Authentication.create({ token: mockedAuthentication.refreshToken }),
    );
  });

  it('should throw DomainError when user is not found', async () => {
    // Arrange
    const useCasePayload = {
      username: 'unknown_user',
      password: 'secret_pass',
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findById: vi.fn(),
      findByUsername: vi.fn().mockResolvedValue(null),
      findByIds: vi.fn(),
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn(),
      existsByToken: vi.fn(),
    };

    const mockAuthenticationTokenManager: AuthenticationTokenManager = {
      createAccessToken: vi.fn(),
      createRefreshToken: vi.fn(),
      decodePayload: vi.fn(),
      verifyRefreshToken: vi.fn(),
      verifyAccessToken: vi.fn(),
    };

    const mockPasswordHash: PasswordHash = {
      compare: vi.fn(),
      hash: vi.fn(),
    };

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action & Assert
    await expect(loginUserUseCase.execute(useCasePayload)).rejects.toThrow(DomainError);
    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
      Username.create(useCasePayload.username),
    );
    expect(mockPasswordHash.compare).not.toHaveBeenCalled();
    expect(mockAuthenticationRepository.save).not.toHaveBeenCalled();
  });
});
