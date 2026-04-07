import { InvariantError } from '@/commons/index.js';

import { Authentication, type AuthenticationRepository } from '@/domains/index.js';

import type { Database } from '../database/postgres.js';

export class PostgresAuthenticationRepository implements AuthenticationRepository {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async save(payload: Authentication): Promise<Authentication> {
    const authentication = payload.toPersistence();

    const result = await this.db.query<{ token: string }>({
      text: 'INSERT INTO authentications (token) VALUES ($1) RETURNING *',
      values: [authentication.token],
    });

    const createdAuthentication = result.rows[0];
    if (!createdAuthentication) throw new InvariantError('gagal membuat authentication');

    return this.mapRowToAuthentication(createdAuthentication);
  }

  async existsByToken(token: string): Promise<boolean> {
    const result = await this.db.query<{ token: string }>({
      text: 'SELECT token FROM authentications WHERE token = $1 LIMIT 1',
      values: [token],
    });

    return Boolean(result.rows[0]);
  }

  async deleteToken(token: string): Promise<void> {
    await this.db.query<{ token: string }>({
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    });
  }

  private mapRowToAuthentication(row: { token: string }): Authentication {
    return Authentication.reconstitute({
      token: row.token,
    });
  }
}
