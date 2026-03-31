import type { LoginDto } from '@/applications/dtos/authentications/login.dto.js';
import type { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager.js';
import type { PasswordHash } from '@/applications/security/password-hash.js';

import {
  Authentication,
  type AuthenticationRepository,
  type UserRepository,
} from '@/domains/index.js';

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

  async execute(dto: LoginDto) {
    const { username, password } = dto;

    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);

    await this._passwordHash.compare(password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._authenticationTokenManager.createAccessToken({ username, id });
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({
      username,
      id,
    });

    const newAuthentication = new Authentication(refreshToken);

    await this._authenticationRepository.addToken(newAuthentication);

    return { accessToken, refreshToken };
  }
}
