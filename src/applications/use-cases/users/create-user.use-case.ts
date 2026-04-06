import type { CreateUserDto } from '@/applications/dtos/index.js';
import type { PasswordHash } from '@/applications/security/index.js';

import {
  DomainError,
  Fullname,
  Password,
  User,
  Username,
  type UserRepository,
} from '@/domains/index.js';

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
    const { username, fullname, password } = this.validateDto(createUserDto);

    const existsUsername = await this.userRepository.existsByUsername(username);
    if (existsUsername) throw new DomainError('USERNAME.NOT_AVAILABLE');

    const hashPassword = await this.passwordHash.hash(password.value);
    const user = User.create({
      username: username.value,
      fullname: fullname.value,
      password: hashPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id.value,
      username: savedUser.username.value,
      fullname: savedUser.fullname.value,
    };
  }

  private validateDto(createUserDto: CreateUserDto): {
    username: Username;
    fullname: Fullname;
    password: Password;
  } {
    return {
      username: Username.create(createUserDto.username),
      fullname: Fullname.create(createUserDto.fullname),
      password: Password.create(createUserDto.password),
    };
  }
}
