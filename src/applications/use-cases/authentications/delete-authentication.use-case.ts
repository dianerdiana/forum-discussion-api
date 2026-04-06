import type { AuthenticationDto } from '@/applications/dtos/index.js';

import {
  type AuthenticationDomainService,
  type AuthenticationRepository,
  DomainError,
} from '@/domains/index.js';

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
    const { refreshToken } = this.validateDto(authDto);

    await this.authenticationDomainService.verifyExistingToken(refreshToken);

    await this.authenticationRepository.deleteToken(refreshToken);
  }

  private validateDto({ refreshToken }: AuthenticationDto): { refreshToken: string } {
    if (!refreshToken) throw new DomainError('REFRESH_TOKEN.EMPTY');
    if (typeof refreshToken !== 'string') throw new DomainError('REFRESH_TOKEN.NOT_STRING');

    return { refreshToken };
  }
}
