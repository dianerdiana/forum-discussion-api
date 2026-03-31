import { InvariantError } from '@/commons/exceptions/invariant-error.js';

import { AuthenticationRepository } from '@/domains/authentication/repository/authentication.repository.js';

import type { Database } from '../database/postgres/db.js';

export class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  private readonly _db: Database;

  constructor(db: Database) {
    super();
    this._db = db;
  }

  async addToken(token: string) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };

    await this._db.query(query);
  }

  async checkAvailabilityToken(token: string) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._db.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token: string) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._db.query(query);
  }
}
