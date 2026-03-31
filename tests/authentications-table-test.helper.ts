/* istanbul ignore file */
import { db } from '../src/infrastructures/database/postgres/db.js';

export const AuthenticationsTableTestHelper = {
  async addToken(token: string) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await db.query(query);
  },

  async findToken(token: string) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await db.query(query);

    return result.rows;
  },
  async cleanTable() {
    await db.query('DELETE FROM authentications WHERE 1=1');
  },
};
