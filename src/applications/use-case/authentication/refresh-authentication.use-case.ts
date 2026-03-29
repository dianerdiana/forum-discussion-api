import type { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager.js';

import type { AuthenticationRepository } from '@/domains/authentication/repository/authentication.repository.js';

import type { AuthenticationDto } from './dto/authentication.dto.js';

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
    this._verifyPayload(dto);
    const { refreshToken } = dto;

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    const { username, id } = await this._authenticationTokenManager.decodePayload(refreshToken);

    return this._authenticationTokenManager.createAccessToken({ username, id });
  }

  _verifyPayload(payload: AuthenticationDto) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
