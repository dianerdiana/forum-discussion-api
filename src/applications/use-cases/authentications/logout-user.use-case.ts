import type { AuthenticationDto } from '@/applications/dtos/index.js';

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
    await this.authenticationDomainService.verifyExistingToken(authDto.refreshToken);

    await this.authenticationRepository.deleteToken(authDto.refreshToken);
  }
}
