import { InvariantError, NotFoundError } from '@/commons/index.js';

import { Comment, CommentId, type CommentRepository, ThreadId } from '@/domains/index.js';

import { Database } from '../database/postgres.js';

export class PostgresCommentRepository implements CommentRepository {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async save(payload: Comment): Promise<Comment> {
    const comment = payload.toPersistence();

    const result = await this.db.query<{
      id: string;
      thread_id: string;
      parent_id: string;
      owner: string;
      content: string;
      created_at: string;
      deleted_at: string | null;
    }>({
      text: `INSERT INTO comments (id, thread_id, parent_id, owner, content)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE
           SET
            thread_id = EXCLUDED.thread_id,
            parent_id = EXCLUDED.parent_id,
            content = EXCLUDED.content,
            owner = EXCLUDED.owner
           RETURNING *`,
      values: [comment.id, comment.threadId, comment.parentId, comment.owner, comment.content],
    });

    const createdComment = result.rows[0];
    if (!createdComment) throw new InvariantError('Failed creating comment');

    return this.mapRowToComment(createdComment);
  }

  async findThreadComments(threadId: ThreadId): Promise<Comment[]> {
    const result = await this.db.query<{
      id: string;
      thread_id: string;
      parent_id: string;
      owner: string;
      content: string;
      created_at: string;
      deleted_at: string | null;
    }>({
      text: 'SELECT * from comments WHERE thread_id = $1 ORDER BY created_at ASC',
      values: [threadId.value],
    });

    return result.rows.map((row) => this.mapRowToComment(row));
  }

  async findById(id: CommentId): Promise<Comment> {
    const result = await this.db.query<{
      id: string;
      thread_id: string;
      parent_id: string;
      owner: string;
      content: string;
      created_at: string;
      deleted_at: string | null;
    }>({
      text: 'SELECT * FROM comments WHERE id = $1 LIMIT 1',
      values: [id.value],
    });

    const row = result.rows[0];
    if (!row) throw new NotFoundError('komentar tidak ditemukan');

    return this.mapRowToComment(row);
  }

  async delete(id: CommentId): Promise<void> {
    await this.db.query({
      text: 'UPDATE comments SET deleted_at=$1 WHERE id = $2',
      values: [new Date(), id.value],
    });
  }

  private mapRowToComment(row: {
    id: string;
    thread_id: string;
    parent_id: string;
    owner: string;
    content: string;
    created_at: string;
    deleted_at: string | null;
  }): Comment {
    return Comment.reconstitute({
      id: row.id,
      threadId: row.thread_id,
      parentId: row.parent_id,
      owner: row.owner,
      content: row.content,
      createdAt: new Date(row.created_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    });
  }
}
