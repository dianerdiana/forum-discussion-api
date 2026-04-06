/* istanbul ignore file */
import { db } from '../src/infrastructures/database/postgres.js';

export const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    parentId = null as string | null,
    owner = 'user-123',
    content = 'A comment content',
  } = {}) {
    const query = {
      text: 'INSERT INTO comments (id, thread_id, parent_id, owner, content) VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, parentId, owner, content],
    };

    await db.query(query);
  },

  async findCommentById(id: string) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);
    return result.rows;
  },

  async cleanTable() {
    await db.query('DELETE FROM comments WHERE 1=1');
  },
};
