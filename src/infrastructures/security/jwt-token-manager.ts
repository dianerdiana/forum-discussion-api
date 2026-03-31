import type { JwtPayload } from 'jsonwebtoken';

import { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager.js';

import config from '@/commons/config.js';
import { InvariantError } from '@/commons/exceptions/invariant-error.js';

import type { JwtAdapter } from './jwt-adapter.js';

export class JwtTokenManager extends AuthenticationTokenManager {
  private readonly _jwt: JwtAdapter;

  constructor(jwt: JwtAdapter) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload: JwtPayload): Promise<string> {
    return this._jwt.sign(payload, config.auth.accessTokenKey);
  }

  async createRefreshToken(payload: JwtPayload): Promise<string> {
    return this._jwt.sign(payload, config.auth.refreshTokenKey);
  }

  async verifyRefreshToken(token: string): Promise<void> {
    try {
      this._jwt.verify(token, config.auth.refreshTokenKey);
    } catch {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token: string): Promise<JwtPayload> {
    const payload = this._jwt.decode(token);

    if (!payload || typeof payload === 'string') {
      throw new InvariantError('payload tidak valid');
    }

    return payload;
  }
}
