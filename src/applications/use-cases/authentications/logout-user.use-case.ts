import type { AuthenticationDto } from '@/applications/dtos/authentications/authentication.dto.js';

import type { AuthenticationRepository } from '@/domains/index.js';

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
    const { refreshToken } = dto;
    const existsToken = await this._authenticationRepository.existsToken(refreshToken);

    if (!existsToken) throw new Error('LOGOUT_USER_USE_CASE.TOKEN_INVALID');

    await this._authenticationRepository.deleteToken(refreshToken);
  }
}
