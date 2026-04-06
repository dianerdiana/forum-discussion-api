import { CommentContent, CommentId } from '../value-objects/index.js';

export interface CommentProps {
  id: CommentId;
  threadId: string;
  parentId: string | null;
  owner: string;
  content: CommentContent;
  createdAt: Date;
  deletedAt: Date | null;
}

export class Comment {
  constructor(private readonly props: CommentProps) {}

  get id(): CommentId {
    return this.props.id;
  }

  get threadId() {
    return this.props.threadId;
  }

  get parentId() {
    return this.props.threadId;
  }

  get owner() {
    return this.props.owner;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  // Factory methods
  static create(props: {
    id?: string;
    parentId: string;
    threadId: string;
    content: string;
    owner: string;
  }): Comment {
    const now = new Date();

    return new Comment({
      id: CommentId.create(props.id),
      threadId: props.threadId,
      parentId: props.parentId,
      owner: props.owner,
      content: CommentContent.create(props.content),
      createdAt: now,
      deletedAt: null,
    });
  }

  static reconstitute(props: {
    id?: string;
    threadId: string;
    parentId: string;
    content: string;
    owner: string;
    createdAt: Date;
    deletedAt: Date | null;
  }): Comment {
    return new Comment({
      id: CommentId.create(props.id),
      threadId: props.threadId,
      parentId: props.parentId,
      content: CommentContent.create(props.content),
      owner: props.owner,
      createdAt: props.createdAt,
      deletedAt: props.deletedAt,
    });
  }

  // For persistence
  toPersistance(): {
    id: string;
    content: string;
    threadId: string;
    parentId: string | null;
    owner: string;
    createdAt: Date;
    deletedAt: Date | null;
  } {
    return {
      id: this.props.id.value,
      threadId: this.props.threadId,
      parentId: this.props.parentId,
      content: this.props.content.value,
      owner: this.props.owner,
      createdAt: this.props.createdAt,
      deletedAt: this.props.deletedAt,
    };
  }
}
