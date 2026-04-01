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

  async execute(authDto: AuthenticationDto) {
    const { refreshToken } = authDto;

    const existsToken = await this._authenticationRepository.existsToken(refreshToken);
    if (!existsToken) throw new Error('Token Invalid');

    await this._authenticationRepository.deleteToken(refreshToken);
  }
}
