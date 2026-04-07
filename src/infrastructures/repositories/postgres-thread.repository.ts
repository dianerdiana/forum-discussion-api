import { InvariantError, NotFoundError } from '@/commons/index.js';

import { Thread, type ThreadId, type ThreadRepository } from '@/domains/index.js';

import type { Database } from '../database/postgres.js';

export class PostgresThreadRepository implements ThreadRepository {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async save(payload: Thread): Promise<Thread> {
    const thread = payload.toPersistence();

    const result = await this.db.query<{
      id: string;
      title: string;
      body: string;
      owner: string;
      created_at: string;
    }>({
      text: `INSERT INTO threads (id, title, body, owner)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE
           SET
            title = EXCLUDED.title,
            body = EXCLUDED.body,
            owner = EXCLUDED.owner
           RETURNING *`,
      values: [thread.id, thread.title, thread.body, thread.owner],
    });

    const createdThread = result.rows[0];
    if (!createdThread) throw new InvariantError('Failed creating user');

    return this.mapRowToThread(createdThread);
  }

  async findById(id: ThreadId): Promise<Thread> {
    const result = await this.db.query<{
      id: string;
      title: string;
      body: string;
      owner: string;
      created_at: string;
    }>({
      text: 'SELECT id, title, body, owner, created_at FROM threads WHERE id = $1 LIMIT 1',
      values: [id.value],
    });

    const row = result.rows[0];
    if (!row) throw new NotFoundError('thread not found');

    return this.mapRowToThread(row);
  }

  private mapRowToThread(row: {
    id: string;
    title: string;
    body: string;
    owner: string;
    created_at: string;
  }): Thread {
    return Thread.reconstitute({
      id: row.id,
      title: row.title,
      body: row.body,
      owner: row.owner,
      createdAt: new Date(row.created_at),
    });
  }
}
