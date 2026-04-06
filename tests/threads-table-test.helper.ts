/* istanbul ignore file */
import { db } from '../src/infrastructures/database/postgres.js';

export const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'Thread Title',
    body = 'Thread body content',
    owner = 'user-123',
  } = {}) {
    const query = {
      text: 'INSERT INTO threads (id, title, body, owner) VALUES($1, $2, $3, $4)',
      values: [id, title, body, owner],
    };

    await db.query(query);
  },

  async findThreadById(id: string) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);
    return result.rows;
  },

  async cleanTable() {
    await db.query('DELETE FROM threads WHERE 1=1');
  },
};
