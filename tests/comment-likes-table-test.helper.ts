/* istanbul ignore file */
import { db } from '../src/infrastructures/database/postgres.js';

export const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = 'like-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    userId = 'user-123',
  } = {}) {
    const query = {
      text: 'INSERT INTO comment_likes (id, thread_id, comment_id, user_id) VALUES($1, $2, $3, $4)',
      values: [id, threadId, commentId, userId],
    };

    await db.query(query);
  },

  async findCommentLikeById(id: string) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);
    return result.rows;
  },

  async findCommentLike({
    threadId,
    commentId,
    userId,
  }: {
    threadId: string;
    commentId: string;
    userId: string;
  }) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3',
      values: [threadId, commentId, userId],
    };

    const result = await db.query(query);
    return result.rows;
  },

  async cleanTable() {
    await db.query('DELETE FROM comment_likes WHERE 1=1');
  },
};
