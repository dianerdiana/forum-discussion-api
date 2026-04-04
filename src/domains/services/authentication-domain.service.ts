import { DomainError } from '../commons/domain-error.js';
import type { AuthenticationRepository } from '../repositories/authentication.repository.js';

export class AuthenticationDomainService {
  private readonly authenticationRepository: AuthenticationRepository;

  constructor({
    authenticationRepository,
  }: {
    authenticationRepository: AuthenticationRepository;
  }) {
    this.authenticationRepository = authenticationRepository;
  }

  async verifyExistingToken(token: string): Promise<void> {
    const existingToken = await this.authenticationRepository.existsByToken(token);

    if (!existingToken) throw new DomainError('REFRESH_TOKEN.NOT_REGISTERED');
  }
}
