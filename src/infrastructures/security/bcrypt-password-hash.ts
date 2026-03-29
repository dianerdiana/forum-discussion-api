import { PasswordHash } from '@/applications/security/password-hash.js';

import { AuthenticationError } from '@/commons/exceptions/authentication-error.js';

export class BcryptPasswordHash extends PasswordHash {
  private readonly _bcrypt: typeof import('bcrypt');
  private readonly _saltRound: number;

  constructor(bcrypt: typeof import('bcrypt'), saltRound: number = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password: string): Promise<string> {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }

    return result;
  }
}
