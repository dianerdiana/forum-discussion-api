import type { JwtPayload } from 'jsonwebtoken';

export class AuthenticationTokenManager {
  async createRefreshToken(_payload: JwtPayload): Promise<string> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async createAccessToken(_payload: JwtPayload): Promise<string> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRefreshToken(_token: string): Promise<void> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async decodePayload(_payload: string): Promise<JwtPayload> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}
