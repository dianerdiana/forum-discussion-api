import type { Comment } from '../entities/index.js';
import type { CommentId, ThreadId } from '../value-objects/index.js';

export interface CommentRepository {
  save(payload: Comment): Promise<Comment>;
  delete(id: CommentId): Promise<void>;
  findThreadComments(threadId: ThreadId): Promise<Comment[]>;
}
