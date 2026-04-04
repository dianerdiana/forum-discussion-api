import type { LoginDto } from '@/applications/dtos/index.js';
import type { AuthenticationTokenManager, PasswordHash } from '@/applications/security/index.js';

import { AuthenticationError } from '@/commons/index.js';

import {
  Authentication,
  type AuthenticationRepository,
  Password,
  Username,
  type UserRepository,
} from '@/domains/index.js';

export class LoginUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly authenticationRepository: AuthenticationRepository;
  private readonly authentictionTokenManage: AuthenticationTokenManager;
  private readonly passwordHash: PasswordHash;

  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }: {
    userRepository: UserRepository;
    authenticationRepository: AuthenticationRepository;
    authenticationTokenManager: AuthenticationTokenManager;
    passwordHash: PasswordHash;
  }) {
    this.userRepository = userRepository;
    this.authenticationRepository = authenticationRepository;
    this.authentictionTokenManage = authenticationTokenManager;
    this.passwordHash = passwordHash;
  }

  async execute(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { password, username } = this.validateDto(loginDto);

    const user = await this.userRepository.findByUsername(username);
    if (!user) throw new AuthenticationError('invalid credentials');

    await this.passwordHash.compare(password.value, user.password.value);

    const accessToken = await this.authentictionTokenManage.createAccessToken({
      userId: user.id.value,
      username: user.username.value,
    });
    const refreshToken = await this.authentictionTokenManage.createRefreshToken({
      userId: user.id.value,
      username: user.username.value,
    });

    const newAuthentication = Authentication.create({ token: refreshToken });

    const savedToken = await this.authenticationRepository.save(newAuthentication);

    return { accessToken, refreshToken: savedToken.token.value };
  }

  private validateDto({ password, username }: LoginDto): {
    username: Username;
    password: Password;
  } {
    if (!username || !password)
      throw new AuthenticationError('username and password must not be empty');

    const validatedPassword = Password.create(password);
    const validatedUsername = Username.create(username);

    return { password: validatedPassword, username: validatedUsername };
  }
}
