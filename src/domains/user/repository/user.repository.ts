import type { RegisteredUser } from '../entities/registered-user.js';

export class UserRepository {
  async addUser(_registerUser: unknown): Promise<RegisteredUser> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableUsername(_username: string): Promise<void> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getPasswordByUsername(_username: string): Promise<string> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getIdByUsername(_username: string): Promise<string> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
