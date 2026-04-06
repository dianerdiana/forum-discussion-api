import { InvariantError } from '@/commons/index.js';

import { User, type UserId, type Username, type UserRepository } from '@/domains/index.js';

import type { Database } from '../database/postgres.js';

export class PostgresUserRepository implements UserRepository {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async save(payload: User): Promise<User> {
    const user = payload.toPersistence();

    const result = await this.db.query<{
      id: string;
      fullname: string;
      username: string;
      password: string;
    }>({
      text: `INSERT INTO users (id, fullname, username, password)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE
       SET
        fullname = EXCLUDED.fullname,
        username = EXCLUDED.username,
        password = EXCLUDED.password
       RETURNING *`,
      values: [user.id, user.fullname, user.username, user.password],
    });

    const createdUser = result.rows[0];
    if (!createdUser) throw new InvariantError('Failed creating user');

    return this.mapRowToUser(createdUser, user.createdAt, user.updatedAt);
  }

  async findById(id: UserId): Promise<User> {
    const result = await this.db.query<{
      id: string;
      fullname: string;
      username: string;
      password: string;
    }>({
      text: 'SELECT id, fullname, username, password FROM users WHERE id = $1 LIMIT 1',
      values: [id.value],
    });

    const row = result.rows[0];
    if (!row) throw new InvariantError('user tidak ditemukan');

    return this.mapRowToUser(row);
  }

  async findByUsername(username: Username): Promise<User | null> {
    const result = await this.db.query<{
      id: string;
      fullname: string;
      username: string;
      password: string;
    }>({
      text: 'SELECT id, fullname, username, password FROM users WHERE username = $1 LIMIT 1',
      values: [username.value],
    });

    const row = result.rows[0];
    if (!row) return null;

    return this.mapRowToUser(row);
  }

  async existsByUsername(username: Username): Promise<boolean> {
    const result = await this.db.query<{ id: string }>({
      text: 'SELECT id FROM users WHERE username = $1 LIMIT 1',
      values: [username.value],
    });

    return Boolean(result.rows[0]);
  }

  private mapRowToUser(
    row: {
      id: string;
      fullname: string;
      username: string;
      password: string;
    },
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): User {
    return User.reconstitute({
      id: row.id,
      username: row.username,
      fullname: row.fullname,
      password: row.password,
      createdAt,
      updatedAt,
    });
  }
}
