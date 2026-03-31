export interface AuthenticationTokenManager {
  createRefreshToken: (payload: object) => Promise<string>;
  createAccessToken: (payload: object) => Promise<string>;
  verifyRefreshToken: (token: string) => Promise<void>;
  decodePayload: (payload: string) => Promise<object>;
}
