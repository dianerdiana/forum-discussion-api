import type { AuthenticationDto } from '@/applications/dtos/index.js';

import type { AuthenticationRepository } from '@/domains/index.js';

export class DeleteAuthenticationUseCase {
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
    if (!existsToken) throw new Error('DELETE_AUTHENTICATION_USE_CASE.TOKEN_INVALID');

    await this._authenticationRepository.deleteToken(refreshToken);
  }
}
