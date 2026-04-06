import type { CreateUserDto } from '@/applications/dtos/index.js';
import type { PasswordHash } from '@/applications/security/index.js';

import { DomainError, User, Username, type UserRepository } from '@/domains/index.js';

export class CreateUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly passwordHash: PasswordHash;

  constructor({
    userRepository,
    passwordHash,
  }: {
    userRepository: UserRepository;
    passwordHash: PasswordHash;
  }) {
    this.userRepository = userRepository;
    this.passwordHash = passwordHash;
  }

  async execute(createUserDto: CreateUserDto): Promise<{
    id: string;
    username: string;
    fullname: string;
  }> {
    const username = Username.create(createUserDto.username);

    const existsUsername = await this.userRepository.existsByUsername(username);
    if (existsUsername) throw new DomainError('USERNAME.NOT_AVAILABLE');

    const hashPassword = await this.passwordHash.hash(createUserDto.password);
    const user = User.create({
      username: createUserDto.username,
      fullname: createUserDto.fullname,
      password: hashPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id.value,
      username: savedUser.username.value,
      fullname: savedUser.fullname.value,
    };
  }
}
