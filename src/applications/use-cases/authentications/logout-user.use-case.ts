import type { AuthenticationDto } from '@/applications/dtos/index.js';

import { InvariantError } from '@/commons/index.js';

import type { AuthenticationDomainService, AuthenticationRepository } from '@/domains/index.js';

export class LogoutUserUseCase {
  private readonly authenticationDomainService: AuthenticationDomainService;
  private readonly authenticationRepository: AuthenticationRepository;

  constructor({
    authenticationDomainService,
    authenticationRepository,
  }: {
    authenticationDomainService: AuthenticationDomainService;
    authenticationRepository: AuthenticationRepository;
  }) {
    this.authenticationDomainService = authenticationDomainService;
    this.authenticationRepository = authenticationRepository;
  }

  async execute(authDto: AuthenticationDto) {
    const { refreshToken } = this.validateDto(authDto);
    await this.authenticationDomainService.verifyExistingToken(refreshToken);

    await this.authenticationRepository.deleteToken(refreshToken);
  }

  private validateDto({ refreshToken }: AuthenticationDto): { refreshToken: string } {
    if (!refreshToken) throw new InvariantError('refresh token is required');
    if (typeof refreshToken !== 'string')
      throw new InvariantError('refresh token must be a string');

    return { refreshToken };
  }
}
