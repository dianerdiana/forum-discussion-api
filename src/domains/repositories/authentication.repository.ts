import type { Authentication } from '../entities/index.js';

export interface AuthenticationRepository {
  save(auth: Authentication): Promise<Authentication>;
  existsToken(token: string): Promise<boolean>;
  deleteToken(token: string): Promise<void>;
}
