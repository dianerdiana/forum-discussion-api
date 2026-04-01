import { vi } from 'vitest';

import type { AuthenticationRepository } from '@/domains/index.js';

import { DeleteAuthenticationUseCase } from '../delete-authentication.use-case.js';

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if refresh token not exists', async () => {
    // Arrange
    const deleteAuthenticationDto = {
      refreshToken: 'refreshToken',
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn().mockResolvedValue(undefined),
      existsToken: vi.fn().mockResolvedValue(false),
    };

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await expect(deleteAuthenticationUseCase.execute(deleteAuthenticationDto)).rejects.toThrow(
      'Token Invalid',
    );

    // Assert
    expect(mockAuthenticationRepository.existsToken).toHaveBeenCalledWith(
      deleteAuthenticationDto.refreshToken,
    );
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const deleteAuthenticationDto = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn().mockResolvedValue(undefined),
      existsToken: vi.fn().mockResolvedValue(true),
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
