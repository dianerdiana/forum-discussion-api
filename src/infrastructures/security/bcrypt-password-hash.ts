import type { PasswordHash } from '@/applications/security/password-hash.js';

import { AuthenticationError } from '@/commons/exceptions/authentication-error.js';

export class BcryptPasswordHash implements PasswordHash {
  private readonly bcrypt: typeof import('bcrypt');
  private readonly saltRound: number;

  constructor(bcrypt: typeof import('bcrypt'), saltRound: number = 10) {
    this.bcrypt = bcrypt;
    this.saltRound = saltRound;
  }

  async hash(password: string): Promise<string> {
    return this.bcrypt.hash(password, this.saltRound);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const result = await this.bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('invalid credentials');
    }

    return result;
  }
}
