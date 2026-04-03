import type { AuthenticationDto } from '@/applications/dtos/index.js';

import type { AuthenticationDomainService, AuthenticationRepository } from '@/domains/index.js';

export class DeleteAuthenticationUseCase {
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
    const { refreshToken } = authDto;

    await this.authenticationDomainService.verifyExistingToken(refreshToken);

    await this.authenticationRepository.deleteToken(refreshToken);
  }

  private validateDto(authDto: AuthenticationDto) {}
}
