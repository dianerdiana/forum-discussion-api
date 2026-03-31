import type { AuthPayload } from '@/domains/index.js';

export interface AuthenticationTokenManager {
  createRefreshToken: (payload: AuthPayload) => Promise<string>;
  createAccessToken: (payload: AuthPayload) => Promise<string>;
  verifyRefreshToken: (token: string) => Promise<void>;
  decodePayload: (payload: string) => Promise<AuthPayload>;
}
