import type { AuthenticationTokenManager } from '@/applications/index.js';

import config from '@/commons/config.js';
import { InvariantError } from '@/commons/index.js';

import type { AuthPayload } from '@/domains/index.js';

import type { JwtAdapter } from './jwt-adapter.js';

export class JwtTokenManager implements AuthenticationTokenManager {
  private readonly jwt: JwtAdapter;

  constructor(jwt: JwtAdapter) {
    this.jwt = jwt;
  }

  async createAccessToken(payload: AuthPayload): Promise<string> {
    return this.jwt.sign(payload, config.auth.accessTokenKey);
  }

  async createRefreshToken(payload: AuthPayload): Promise<string> {
    return this.jwt.sign(payload, config.auth.refreshTokenKey);
  }

  async verifyRefreshToken(token: string): Promise<void> {
    try {
      this.jwt.verify(token, config.auth.refreshTokenKey);
    } catch {
      throw new InvariantError('Refresh Token Invalid');
    }
  }

  async decodePayload(token: string): Promise<AuthPayload> {
    const payload = this.jwt.decode(token);

    if (!payload || typeof payload === 'string') {
      throw new InvariantError('Payload Invalid');
    }

    if (typeof payload.userId !== 'string' || typeof payload.username !== 'string') {
      throw new InvariantError('Payload Invalid');
    }

    return { userId: payload.userId, username: payload.username };
  }
}
