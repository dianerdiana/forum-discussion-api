import type { AuthenticationDto } from '@/applications/dtos/index.js';
import type { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager.js';

import type { AuthenticationRepository } from '@/domains/index.js';

export class RefreshAuthenticationUseCase {
  private readonly _authenticationRepository: AuthenticationRepository;
  private readonly _authenticationTokenManager: AuthenticationTokenManager;

  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }: {
    authenticationRepository: AuthenticationRepository;
    authenticationTokenManager: AuthenticationTokenManager;
  }) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(dto: AuthenticationDto) {
    const { refreshToken } = dto;

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.existsToken(refreshToken);

    const { username, userId } = await this._authenticationTokenManager.decodePayload(refreshToken);

    return this._authenticationTokenManager.createAccessToken({ username, userId });
  }
}
