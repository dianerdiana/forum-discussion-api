import { vi } from 'vitest';

import { NewAuth } from '@/domains/authentication/entities/new-auth.js';
import { AuthenticationRepository } from '@/domains/authentication/repository/authentication.repository.js';
import { UserRepository } from '@/domains/user/repository/user.repository.js';

import { AuthenticationTokenManager } from '../../../security/authentication-token-manager.js';
import { PasswordHash } from '../../../security/password-hash.js';
import { LoginUserUseCase } from '../login-user.use-case.js';

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking
    mockUserRepository.getPasswordByUsername = vi
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = vi.fn().mockImplementation(() => Promise.resolve());
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
    expect(actualAuthentication).toEqual(
      new NewAuth({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      }),
    );
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith('secret', 'encrypted_password');
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
