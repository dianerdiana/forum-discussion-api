import { vi } from 'vitest';

import { RegisterUser } from '@/domains/user/entities/register-user.js';
import { RegisteredUser } from '@/domains/user/entities/registered-user.js';
import { UserRepository } from '@/domains/user/repository/user.repository.js';

import { PasswordHash } from '../../../security/password-hash.js';
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

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = vi.fn().mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(
      new RegisteredUser({
        id: 'user-123',
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      }),
    );

    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(
      useCasePayload.username,
    );
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted_password',
        fullname: useCasePayload.fullname,
      }),
    );
  });
});
