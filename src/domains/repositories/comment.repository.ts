import type { Comment } from '../entities/index.js';
import type { CommentId } from '../value-objects/index.js';

export interface CommentRepository {
  save(payload: Comment): Promise<Comment>;
  delete(id: CommentId): Promise<void>;
}
