import { InvariantError } from '@/commons/exceptions/invariant-error.js';

import type { IdGenerator } from '@/domains/common/id-generator.js';
import type { RegisterUser } from '@/domains/user/entities/register-user.js';
import { RegisteredUser } from '@/domains/user/entities/registered-user.js';
import { UserRepository } from '@/domains/user/repository/user.repository.js';

import type { Database } from '../database/postgres/db.js';

export class UserRepositoryPostgres extends UserRepository {
  private readonly _db: Database;
  private readonly _idGenerator: IdGenerator;

  constructor(db: Database, idGenerator: IdGenerator) {
    super();
    this._db = db;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username: string) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._db.query(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser: RegisterUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator.generate()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this._db.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username: string) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._db.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username: string) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._db.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }
}
