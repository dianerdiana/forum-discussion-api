import type { AuthenticationDto } from '@/applications/dtos/index.js';
import type { AuthenticationTokenManager } from '@/applications/security/index.js';

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

  async execute(authenticationDto: AuthenticationDto) {
    const { refreshToken } = authenticationDto;

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationDomainService.verifyExistingToken(refreshToken);

    const { username, userId } = await this.authenticationTokenManager.decodePayload(refreshToken);

    return this.authenticationTokenManager.createAccessToken({ username, userId });
  }
}
