import { vi } from 'vitest';

import { type AuthenticationRepository } from '@/domains/index.js';

import { LogoutUserUseCase } from '../logout-user.use-case.js';

describe('LogoutUserUseCase', () => {
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
