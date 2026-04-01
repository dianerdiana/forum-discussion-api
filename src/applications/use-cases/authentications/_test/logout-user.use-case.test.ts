import { vi } from 'vitest';

import { type AuthenticationRepository } from '@/domains/index.js';

import { LogoutUserUseCase } from '../logout-user.use-case.js';

describe('LogoutUserUseCase', () => {
  it('should throw error if refresh token not exists', async () => {
    // Arrange
    const logoutDto = {
      refreshToken: 'refreshToken',
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn().mockResolvedValue(undefined),
      existsToken: vi.fn().mockResolvedValue(false),
    };

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await expect(logoutUserUseCase.execute(logoutDto)).rejects.toThrow('Token Invalid');

    // Assert
    expect(mockAuthenticationRepository.existsToken).toHaveBeenCalledWith(logoutDto.refreshToken);
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const logoutDto = {
      refreshToken: 'refreshToken',
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn().mockResolvedValue(undefined),
      existsToken: vi.fn().mockResolvedValue(true),
    };

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await logoutUserUseCase.execute(logoutDto);

    // Assert
    expect(mockAuthenticationRepository.existsToken).toHaveBeenCalledWith(logoutDto.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(logoutDto.refreshToken);
  });
});
