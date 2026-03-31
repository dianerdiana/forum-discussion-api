/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

import type { AuthenticationRepository } from '@/domains/index.js';

import { DeleteAuthenticationUseCase } from '../delete-authentication.use-case.js';

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const deleteAuthenticationDto: any = {};
    const authenticationRepository: AuthenticationRepository = {
      addToken: vi.fn(),
      deleteToken: vi.fn(),
      existsToken: vi.fn(),
    };
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
    const deleteAuthenticationDto: any = {
      refreshToken: 123,
    };
    const authenticationRepository: AuthenticationRepository = {
      addToken: vi.fn(),
      deleteToken: vi.fn(),
      existsToken: vi.fn(),
    };
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
    const mockAuthenticationRepository: AuthenticationRepository = {
      addToken: vi.fn(),
      existsToken: vi.fn().mockImplementation(() => Promise.resolve()),
      deleteToken: vi.fn().mockImplementation(() => Promise.resolve()),
    };

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await deleteAuthenticationUseCase.execute(deleteAuthenticationDto);

    // Assert
    expect(mockAuthenticationRepository.existsToken).toHaveBeenCalledWith(
      deleteAuthenticationDto.refreshToken,
    );
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      deleteAuthenticationDto.refreshToken,
    );
  });
});
