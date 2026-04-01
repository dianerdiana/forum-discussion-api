import { vi } from 'vitest';

import type { AuthenticationDomainService, AuthenticationRepository } from '@/domains/index.js';

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
      existsToken: vi.fn().mockResolvedValue(true),
    };
    const mockAuthenticationDomainService = {
      verifyExistingToken: vi.fn().mockRejectedValue(new Error('Token Invalid')),
    } as unknown as AuthenticationDomainService;

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationDomainService: mockAuthenticationDomainService,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await expect(deleteAuthenticationUseCase.execute(deleteAuthenticationDto)).rejects.toThrow(
      'Token Invalid',
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
      existsToken: vi.fn().mockResolvedValue(true),
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
