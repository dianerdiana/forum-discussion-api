import { vi } from 'vitest';

import type { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager.js';

import type { AuthenticationDomainService } from '@/domains/index.js';

import { RefreshAuthenticationUseCase } from '../refresh-authentication.use-case.js';

describe('RefreshAuthenticationUseCase', () => {
  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token',
    };

    const mockAuthenticationDomainService = {
      verifyExistingToken: vi.fn().mockResolvedValue(undefined),
    } as unknown as AuthenticationDomainService;

    const mockAuthenticationTokenManager: AuthenticationTokenManager = {
      createAccessToken: vi.fn().mockResolvedValue('some_new_access_token'),
      createRefreshToken: vi.fn().mockResolvedValue(undefined),
      decodePayload: vi.fn().mockResolvedValue({
        userId: 'user-123',
        username: 'dicoding',
      }),
      verifyRefreshToken: vi.fn(),
    };

    // Create the use case instace
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
    expect(mockAuthenticationDomainService.verifyExistingToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({
      userId: 'user-123',
      username: 'dicoding',
    });
    expect(accessToken).toEqual('some_new_access_token');
  });
});
