import { vi } from 'vitest';

import type { AuthenticationDomainService, AuthenticationRepository } from '@/domains/index.js';
import { DomainError } from '@/domains/index.js';

import { LogoutUserUseCase } from '../logout-user.use-case.js';

describe('LogoutUserUseCase', () => {
  it('should throw DomainError when refreshToken is empty', async () => {
    // Arrange
    const logoutDto = {
      refreshToken: '',
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn(),
      existsByToken: vi.fn(),
    };
    const mockAuthenticationDomainService = {
      verifyExistingToken: vi.fn(),
    } as unknown as AuthenticationDomainService;

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action & Assert
    await expect(logoutUserUseCase.execute(logoutDto)).rejects.toThrow(DomainError);
  });

  it('should throw DomainError when refreshToken is not a string', async () => {
    // Arrange
    const logoutDto = {
      refreshToken: 123 as unknown as string,
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn(),
      existsByToken: vi.fn(),
    };
    const mockAuthenticationDomainService = {
      verifyExistingToken: vi.fn(),
    } as unknown as AuthenticationDomainService;

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action & Assert
    await expect(logoutUserUseCase.execute(logoutDto)).rejects.toThrow(DomainError);
  });

  it('should throw error if refresh token not exists', async () => {
    // Arrange
    const logoutDto = {
      refreshToken: 'refreshToken',
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn().mockResolvedValue(undefined),
      existsByToken: vi.fn().mockResolvedValue(false),
    };
    const mockAuthenticationDomainService = {
      verifyExistingToken: vi.fn().mockRejectedValue(new Error('Token Invalid')),
    } as unknown as AuthenticationDomainService;

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await expect(logoutUserUseCase.execute(logoutDto)).rejects.toThrow('Token Invalid');

    // Assert
    expect(mockAuthenticationDomainService.verifyExistingToken).toHaveBeenCalledWith(
      logoutDto.refreshToken,
    );
    expect(mockAuthenticationRepository.deleteToken).not.toHaveBeenCalled();
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const logoutDto = {
      refreshToken: 'refreshToken',
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn().mockResolvedValue(undefined),
      existsByToken: vi.fn().mockResolvedValue(true),
    };
    const mockAuthenticationDomainService = {
      verifyExistingToken: vi.fn().mockResolvedValue(undefined),
    } as unknown as AuthenticationDomainService;

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await logoutUserUseCase.execute(logoutDto);

    // Assert
    expect(mockAuthenticationDomainService.verifyExistingToken).toHaveBeenCalledWith(
      logoutDto.refreshToken,
    );
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(logoutDto.refreshToken);
  });
});
