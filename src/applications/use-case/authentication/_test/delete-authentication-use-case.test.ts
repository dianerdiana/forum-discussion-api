/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

import { AuthenticationRepository } from '@/domains/authentication/repository/authentication.repository.js';

import { DeleteAuthenticationUseCase } from '../delete-authentication.use-case.js';

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const deleteAuthenticationDto = {} as any;
    const authenticationRepository = new AuthenticationRepository();
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository,
    });

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(deleteAuthenticationDto)).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
    );
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const deleteAuthenticationDto = {
      refreshToken: 123,
    } as any;
    const authenticationRepository = new AuthenticationRepository();
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository,
    });

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(deleteAuthenticationDto)).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const deleteAuthenticationDto = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.checkAvailabilityToken = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = vi.fn().mockImplementation(() => Promise.resolve());

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await deleteAuthenticationUseCase.execute(deleteAuthenticationDto);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(
      deleteAuthenticationDto.refreshToken,
    );
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      deleteAuthenticationDto.refreshToken,
    );
  });
});
