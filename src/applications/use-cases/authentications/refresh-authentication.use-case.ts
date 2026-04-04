import type { AuthenticationDto } from '@/applications/dtos/index.js';
import type { AuthenticationTokenManager } from '@/applications/security/index.js';

import { InvariantError } from '@/commons/index.js';

import type { AuthenticationDomainService } from '@/domains/index.js';

export class RefreshAuthenticationUseCase {
  private readonly authenticationDomainService: AuthenticationDomainService;
  private readonly authenticationTokenManager: AuthenticationTokenManager;

  constructor({
    authenticationDomainService,
    authenticationTokenManager,
  }: {
    authenticationDomainService: AuthenticationDomainService;
    authenticationTokenManager: AuthenticationTokenManager;
  }) {
    this.authenticationDomainService = authenticationDomainService;
    this.authenticationTokenManager = authenticationTokenManager;
  }

  async execute(authDto: AuthenticationDto) {
    const { refreshToken } = this.validateDto(authDto);

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationDomainService.verifyExistingToken(refreshToken);

    const { username, userId } = await this.authenticationTokenManager.decodePayload(refreshToken);

    return this.authenticationTokenManager.createAccessToken({ username, userId });
  }

  private validateDto({ refreshToken }: AuthenticationDto): { refreshToken: string } {
    if (!refreshToken) throw new InvariantError('refresh token is required');
    if (typeof refreshToken !== 'string')
      throw new InvariantError('refresh token must be a string');

    return { refreshToken };
  }
}
