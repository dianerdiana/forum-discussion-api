/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

import type { AuthenticationRepository } from '@/domains/index.js';

import { LogoutUserUseCase } from '../logout-user.use-case.js';

describe('LogoutUserUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const logoutDto: any = {};
    const authenticationRepository: AuthenticationRepository = {
      addToken: vi.fn(),
      deleteToken: vi.fn(),
      existsToken: vi.fn(),
    };
    const logoutUserUseCase = new LogoutUserUseCase({ authenticationRepository });

    // Action & Assert
    await expect(logoutUserUseCase.execute(logoutDto)).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
    );
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const logoutDto: any = {
      refreshToken: 123,
    };
    const authenticationRepository: AuthenticationRepository = {
      addToken: vi.fn(),
      deleteToken: vi.fn(),
      existsToken: vi.fn(),
    };
    const logoutUserUseCase = new LogoutUserUseCase({ authenticationRepository });

    // Action & Assert
    await expect(logoutUserUseCase.execute(logoutDto)).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const logoutDto = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository: AuthenticationRepository = {
      addToken: vi.fn(),
      deleteToken: vi.fn(),
      existsToken: vi.fn(),
    };
    mockAuthenticationRepository.existsToken = vi.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = vi.fn().mockImplementation(() => Promise.resolve());

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
