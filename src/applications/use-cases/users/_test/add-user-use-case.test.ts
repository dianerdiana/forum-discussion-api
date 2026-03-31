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

    const mockRegisteredUser = {
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    };

    /** creating dependency of use case */
    const mockUserRepository: UserRepository = {
      existsUsername: vi.fn(),
      addUser: vi.fn(),
      getIdByUsername: vi.fn(),
      getPasswordByUsername: vi.fn(),
    };
    const mockPasswordHash: PasswordHash = {
      hash: vi.fn(),
      compare: vi.fn(),
    };
    const mockIdGenerator: IdGenerator = {
      generate: vi.fn(),
    };

    /** mocking needed function */
    mockUserRepository.existsUsername = vi.fn().mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = vi.fn().mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      idGenerator: mockIdGenerator,
    });

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    expect(mockUserRepository.existsUsername).toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    });
  });
});
