import type { Authentication } from '../entities/authentication.js';

export interface AuthenticationRepository {
  addToken: (auth: Authentication) => Promise<void>;
  isTokenValid: (token: string) => Promise<boolean>;
  deleteToken: (token: string) => Promise<void>;
}
