import { vi } from 'vitest';

import type { PasswordHash } from '@/applications/security/index.js';

import { User, UserId, Username, type UserRepository } from '@/domains/index.js';

import { CreateUserUseCase } from '../create-user.use-case.js';

describe('CreateUserUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret_pass',
      fullname: 'Dicoding Indonesia',
    };

    const user = User.create({
      username: useCasePayload.username,
      password: useCasePayload.password,
      fullname: useCasePayload.fullname,
    });

    const saveMock = vi.fn().mockResolvedValue(user);

    const mockUserRepository: UserRepository = {
      existsByUsername: vi.fn().mockResolvedValue(false),
      save: saveMock,
      findByUsername: vi.fn(),
      findById: vi.fn(),
    };

    const mockPasswordHash: PasswordHash = {
      hash: vi.fn().mockResolvedValue('encrypted_password'),
      compare: vi.fn(),
    };

    const createUserUseCase = new CreateUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await createUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual({
      id: user.id.value,
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    expect(mockUserRepository.existsByUsername).toHaveBeenCalledWith(
      Username.create(useCasePayload.username),
    );
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
    expect(saveMock).toHaveBeenCalledOnce();

    const savedUserArg = saveMock.mock.calls[0]![0];

    expect(savedUserArg.id).toBeInstanceOf(UserId);
    expect(savedUserArg.username.value).toBe(useCasePayload.username);
    expect(savedUserArg.password.value).toBe('encrypted_password');
    expect(savedUserArg.fullname.value).toBe(useCasePayload.fullname);
  });
});
