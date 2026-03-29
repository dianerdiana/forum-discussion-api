import type { AuthenticationRepository } from '@/domains/authentication/repository/authentication.repository.js';

import type { AuthenticationDto } from './dto/authentication.dto.js';

export class LogoutUserUseCase {
  private readonly _authenticationRepository: AuthenticationRepository;

  constructor({
    authenticationRepository,
  }: {
    authenticationRepository: AuthenticationRepository;
  }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(dto: AuthenticationDto) {
    this._validatePayload(dto);
    const { refreshToken } = dto;
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  _validatePayload(payload: AuthenticationDto) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
