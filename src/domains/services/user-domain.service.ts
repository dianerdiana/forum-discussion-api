import { DomainError } from '../commons/domain-error.js';
import type { UserRepository } from '../repositories/index.js';
import { Username } from '../value-objects/index.js';

export class UserDomainService {
  constructor(private readonly userRepository: UserRepository) {}

  async validateUsername(username: string): Promise<void> {
    const existingUsername = await this.userRepository.existsByUsername(Username.create(username));
    if (!existingUsername) throw new DomainError('USER.NOT_FOUND');
  }
}
