import { vi } from 'vitest';

import type { PasswordHash } from '@/applications/security/password-hash.js';

import type { IdGenerator, UserRepository } from '@/domains/index.js';

import { AddUserUseCase } from '../add-user.use-case.js';

describe('AddUserUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const fakeId = 'user-123';

    const mockUserRepository: UserRepository = {
      existsUsername: vi.fn().mockResolvedValue(false),
      addUser: vi.fn().mockResolvedValue(undefined),
      getIdByUsername: vi.fn(),
      getPasswordByUsername: vi.fn(),
    };

    const mockPasswordHash: PasswordHash = {
      hash: vi.fn().mockResolvedValue('encrypted_password'),
      compare: vi.fn(),
    };

    const mockIdGenerator: IdGenerator = {
      generate: vi.fn().mockReturnValue(fakeId),
    };

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      idGenerator: mockIdGenerator,
    });

    // Action
    const registeredUser = await addUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual({
      id: fakeId,
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    expect(mockUserRepository.existsUsername).toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);

    expect(mockUserRepository.addUser).toHaveBeenCalledWith({
      id: fakeId,
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    });
  });
});
