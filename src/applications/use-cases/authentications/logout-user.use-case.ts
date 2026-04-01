import type { AuthenticationDto } from '@/applications/dtos/index.js';

import type { AuthenticationRepository } from '@/domains/index.js';

export class LogoutUserUseCase {
  private readonly authenticationRepository: AuthenticationRepository;

  constructor({
    authenticationRepository,
  }: {
    authenticationRepository: AuthenticationRepository;
  }) {
    this.authenticationRepository = authenticationRepository;
  }

  async execute(authDto: AuthenticationDto) {
    const existsToken = await this.authenticationRepository.existsToken(authDto.refreshToken);

    if (!existsToken) throw new Error('Token Invalid');

    await this.authenticationRepository.deleteToken(authDto.refreshToken);
  }
}
