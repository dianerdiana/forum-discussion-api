import type { PasswordHash } from '@/applications/security/password-hash.js';

import { RegisterUser } from '@/domains/user/entities/register-user.js';
import type { UserRepository } from '@/domains/user/repository/user.repository.js';

import type { AddUserDto } from './dto/add-user.dto.js';

export class AddUserUseCase {
  private readonly _userRepository: UserRepository;
  private readonly _passwordHash: PasswordHash;

  constructor({
    userRepository,
    passwordHash,
  }: {
    userRepository: UserRepository;
    passwordHash: PasswordHash;
  }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(addUserDto: AddUserDto) {
    const registerUser = new RegisterUser(addUserDto);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}
