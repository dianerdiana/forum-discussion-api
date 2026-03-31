export class Authentication {
  constructor(public readonly token: string) {
    if (!token) {
      throw new Error('AUTHENTICATION_TOKEN_REQUIRED');
    }
  }
}
