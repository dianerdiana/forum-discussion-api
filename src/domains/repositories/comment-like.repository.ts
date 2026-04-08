import type { CommentLike } from '../entities/index.js';
import type { CommentId, ThreadId, UserId } from '../value-objects/index.js';

export interface CommentLikeRepository {
  save(payload: CommentLike): Promise<CommentLike>;
  findOne(payload: {
    threadId: ThreadId;
    commentId: CommentId;
    userId: UserId;
  }): Promise<CommentLike | null>;
  findThreadCommentLikes(threadId: ThreadId): Promise<CommentLike[]>;
  delete(payload: { threadId: ThreadId; commentId: CommentId; userId: UserId }): Promise<void>;
}
