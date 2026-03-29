import type { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager.js';
import type { PasswordHash } from '@/applications/security/password-hash.js';

import { NewAuth as NewAuthentication } from '@/domains/authentication/entities/new-auth.js';
import type { AuthenticationRepository } from '@/domains/authentication/repository/authentication.repository.js';
import { UserLogin } from '@/domains/user/entities/user-login.js';
import type { UserRepository } from '@/domains/user/repository/user.repository.js';

import type { LoginDto } from './dto/login.dto.js';

export class LoginUserUseCase {
  private readonly _userRepository: UserRepository;
  private readonly _authenticationRepository: AuthenticationRepository;
  private readonly _authenticationTokenManager: AuthenticationTokenManager;
  private readonly _passwordHash: PasswordHash;

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
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(loginDto: LoginDto) {
    const { username, password } = new UserLogin(loginDto);

    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);

    await this._passwordHash.comparePassword(password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._authenticationTokenManager.createAccessToken({ username, id });
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({
      username,
      id,
    });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this._authenticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}
