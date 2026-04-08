import { CommentId, CommentLikeId, ThreadId, UserId } from '../value-objects/index.js';

export interface CommentProps {
  id: CommentLikeId;
  threadId: ThreadId;
  commentId: CommentId;
  userId: UserId;
  createdAt: Date;
}

export class CommentLike {
  constructor(private readonly props: CommentProps) {}

  get id(): CommentLikeId {
    return this.props.id;
  }

  get threadId() {
    return this.props.threadId;
  }

  get commentId() {
    return this.props.commentId;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  // Factory methods
  static create(props: {
    id?: string;
    commentId: string;
    threadId: string;
    userId: string;
  }): CommentLike {
    const now = new Date();

    return new CommentLike({
      id: CommentLikeId.create(props.id),
      threadId: ThreadId.create(props.threadId),
      commentId: CommentId.create(props.commentId),
      userId: UserId.create(props.userId),
      createdAt: now,
    });
  }

  static reconstitute(props: {
    id?: string;
    threadId: string;
    commentId: string;
    userId: string;
    createdAt: Date;
  }): CommentLike {
    return new CommentLike({
      id: CommentLikeId.create(props.id),
      threadId: ThreadId.create(props.threadId),
      commentId: CommentId.create(props.commentId),
      userId: UserId.create(props.userId),
      createdAt: props.createdAt,
    });
  }

  // For persistence
  toPersistence(): {
    id: string;
    threadId: string;
    commentId: string | null;
    userId: string;
    createdAt: Date;
  } {
    return {
      id: this.props.id.value,
      threadId: this.props.threadId.value,
      commentId: this.props.commentId.value,
      userId: this.props.userId.value,
      createdAt: this.props.createdAt,
    };
  }
}
