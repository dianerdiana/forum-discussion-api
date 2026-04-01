import type { AddUserDto } from '@/applications/dtos/users/add-user.dto.js';
import type { PasswordHash } from '@/applications/security/password-hash.js';

import { type IdGenerator, User, type UserRepository } from '@/domains/index.js';

export class AddUserUseCase {
  private readonly _userRepository: UserRepository;
  private readonly _passwordHash: PasswordHash;
  private readonly _idGenerator: IdGenerator;

  constructor({
    userRepository,
    passwordHash,
    idGenerator,
  }: {
    userRepository: UserRepository;
    passwordHash: PasswordHash;
    idGenerator: IdGenerator;
  }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._idGenerator = idGenerator;
  }

  async execute(dto: AddUserDto) {
    const id = this._idGenerator.generate();
    const registerUser = new User(id, dto.username, dto.password, dto.fullname);

    const existsUsername = await this._userRepository.existsUsername(registerUser.username);
    if (existsUsername) throw new Error('ADD_USER_USE_CASE.USERNAME_NOT_AVAILABLE');

    const hashPassword = await this._passwordHash.hash(registerUser.password);
    const registeredUser = { ...registerUser, password: hashPassword };
    await this._userRepository.addUser(registeredUser);

    return {
      id: registeredUser.id,
      username: registeredUser.username,
      fullname: registeredUser.fullname,
    };
  }
}
