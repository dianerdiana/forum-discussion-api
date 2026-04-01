import type { AuthenticationDto } from '@/applications/dtos/index.js';
import type { AuthenticationTokenManager } from '@/applications/security/index.js';

import type { AuthenticationRepository } from '@/domains/index.js';

export class RefreshAuthenticationUseCase {
  private readonly authenticationRepository: AuthenticationRepository;
  private readonly authenticationTokenManager: AuthenticationTokenManager;

  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }: {
    authenticationRepository: AuthenticationRepository;
    authenticationTokenManager: AuthenticationTokenManager;
  }) {
    this.authenticationRepository = authenticationRepository;
    this.authenticationTokenManager = authenticationTokenManager;
  }

  async execute(authenticationDto: AuthenticationDto) {
    const { refreshToken } = authenticationDto;

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationRepository.existsToken(refreshToken);

    const { username, userId } = await this.authenticationTokenManager.decodePayload(refreshToken);

    return this.authenticationTokenManager.createAccessToken({ username, userId });
  }
}
