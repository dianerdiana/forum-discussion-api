import type { AuthPayload } from '@/domains/index.js';

export interface AuthenticationTokenManager {
  createRefreshToken: (payload: AuthPayload) => Promise<string>;
  createAccessToken: (payload: AuthPayload) => Promise<string>;
  verifyAccessToken: (token: string) => Promise<void>;
  verifyRefreshToken: (token: string) => Promise<void>;
  decodePayload: (payload: string) => Promise<AuthPayload>;
}
