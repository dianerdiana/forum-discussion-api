import type { AuthenticationTokenManager } from '@/applications/index.js';

import config from '@/commons/config.js';
import { InvariantError } from '@/commons/index.js';

import type { AuthPayload } from '@/domains/index.js';

import type { JwtAdapter } from './jwt-adapter.js';

export class JwtTokenManager implements AuthenticationTokenManager {
  private readonly jwtAdapter: JwtAdapter;

  constructor(jwtAdapter: JwtAdapter) {
    this.jwtAdapter = jwtAdapter;
  }

  async createAccessToken(payload: AuthPayload): Promise<string> {
    return this.jwtAdapter.sign(payload, config.auth.accessTokenKey);
  }

  async createRefreshToken(payload: AuthPayload): Promise<string> {
    return this.jwtAdapter.sign(payload, config.auth.refreshTokenKey);
  }

  async verifyRefreshToken(token: string): Promise<void> {
    try {
      this.jwtAdapter.verify(token, config.auth.refreshTokenKey);
    } catch {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token: string): Promise<AuthPayload> {
    const payload = this.jwtAdapter.decode(token);

    if (!payload || typeof payload === 'string') {
      throw new InvariantError('token tidak valid');
    }

    if (typeof payload.userId !== 'string' || typeof payload.username !== 'string') {
      throw new InvariantError('token tidak valid');
    }

    return { userId: payload.userId, username: payload.username };
  }
}
