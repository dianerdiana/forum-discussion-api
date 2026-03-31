/* istanbul ignore file */
import { db } from '../src/infrastructures/database/postgres/db.js';

export const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };

    await db.query(query);
  },

  async findUsersById(id: string) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);
    return result.rows;
  },

  async cleanTable() {
    await db.query('DELETE FROM users WHERE 1=1');
  },
};
