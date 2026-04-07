import { vi } from 'vitest';

import type { AuthenticationDomainService, AuthenticationRepository } from '@/domains/index.js';
import { DomainError } from '@/domains/index.js';

import { DeleteAuthenticationUseCase } from '../delete-authentication.use-case.js';

describe('DeleteAuthenticationUseCase', () => {
  it('should throw DomainError when refreshToken is empty', async () => {
    // Arrange
    const deleteAuthenticationDto = {
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

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(deleteAuthenticationDto)).rejects.toThrow(
      DomainError,
    );
  });

  it('should throw DomainError when refreshToken is not a string', async () => {
    // Arrange
    const deleteAuthenticationDto = {
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

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(deleteAuthenticationDto)).rejects.toThrow(
      DomainError,
    );
  });

  it('should throw error if refresh token not exists', async () => {
    // Arrange
    const deleteAuthenticationDto = {
      refreshToken: 'refreshToken',
    };

    const mockAuthenticationRepository: AuthenticationRepository = {
      save: vi.fn(),
      deleteToken: vi.fn().mockResolvedValue(undefined),
      existsByToken: vi.fn().mockResolvedValue(true),
    };
    const mockAuthenticationDomainService = {
      verifyExistingToken: vi.fn().mockRejectedValue(new Error('token invalid')),
    } as unknown as AuthenticationDomainService;

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await expect(deleteAuthenticationUseCase.execute(deleteAuthenticationDto)).rejects.toThrow(
      'token invalid',
    );

    // Assert
    expect(mockAuthenticationDomainService.verifyExistingToken).toHaveBeenCalledWith(
      deleteAuthenticationDto.refreshToken,
    );
    expect(mockAuthenticationRepository.deleteToken).not.toHaveBeenCalled();
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const deleteAuthenticationDto = {
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

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await deleteAuthenticationUseCase.execute(deleteAuthenticationDto);

    // Assert
    expect(mockAuthenticationDomainService.verifyExistingToken).toHaveBeenCalledWith(
      deleteAuthenticationDto.refreshToken,
    );
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      deleteAuthenticationDto.refreshToken,
    );
  });
});
