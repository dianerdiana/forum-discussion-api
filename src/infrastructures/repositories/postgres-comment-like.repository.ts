import { InvariantError } from '@/commons/index.js';

import {
  CommentId,
  CommentLike,
  type CommentLikeRepository,
  ThreadId,
  UserId,
} from '@/domains/index.js';

import type { Database } from '../database/postgres.js';

export class PostgresCommentLikeRepository implements CommentLikeRepository {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async save(payload: CommentLike): Promise<CommentLike> {
    const { id, threadId, commentId, userId } = payload.toPersistence();

    const result = await this.db.query<{
      id: string;
      thread_id: string;
      comment_id: string;
      user_id: string;
      created_at: string;
    }>({
      text: `INSERT INTO comment_likes (id,thread_id,comment_id,user_id) 
        VALUES ($1,$2,$3,$4)
           ON CONFLICT (id) DO UPDATE
           SET
            thread_id = EXCLUDED.thread_id,
            comment_id = EXCLUDED.comment_id,
            user_id = EXCLUDED.user_id
           RETURNING *;`,
      values: [id, threadId, commentId, userId],
    });

    const createdCommentLike = result.rows[0];
    if (!createdCommentLike) throw new InvariantError('gagal menyukai komentar');

    return this.mapRowToCommentLike(createdCommentLike);
  }

  async findOne(payload: {
    threadId: ThreadId;
    commentId: CommentId;
    userId: UserId;
  }): Promise<CommentLike | null> {
    const result = await this.db.query<{
      id: string;
      thread_id: string;
      comment_id: string;
      user_id: string;
      created_at: string;
    }>({
      text: `SELECT id, thread_id, comment_id, user_id, created_at 
        FROM comment_likes
          WHERE
            thread_id = $1
            AND comment_id = $2
            AND user_id = $3
          LIMIT 1;`,
      values: [payload.threadId.value, payload.commentId.value, payload.userId.value],
    });

    const row = result.rows[0];
    if (!row) return null;

    return this.mapRowToCommentLike(row);
  }

  async findThreadCommentLikes(threadId: ThreadId): Promise<CommentLike[]> {
    const result = await this.db.query<{
      id: string;
      thread_id: string;
      comment_id: string;
      user_id: string;
      created_at: string;
    }>({
      text: 'SELECT id, thread_id, comment_id, user_id, created_at FROM comment_likes WHERE thread_id = $1;',
      values: [threadId.value],
    });

    return result.rows.map((row) => this.mapRowToCommentLike(row));
  }

  async delete(payload: {
    threadId: ThreadId;
    commentId: CommentId;
    userId: UserId;
  }): Promise<void> {
    await this.db.query<{
      id: string;
      thread_id: string;
      comment_id: string;
      user_id: string;
      created_at: string;
    }>({
      text: 'DELETE FROM comment_likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3;',
      values: [payload.threadId.value, payload.commentId.value, payload.userId.value],
    });
  }

  private mapRowToCommentLike(row: {
    id: string;
    thread_id: string;
    comment_id: string;
    user_id: string;
    created_at: string;
  }): CommentLike {
    return CommentLike.reconstitute({
      id: row.id,
      threadId: row.thread_id,
      commentId: row.comment_id,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
    });
  }
}
