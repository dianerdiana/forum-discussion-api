import { ThreadBody, ThreadId, ThreadTitle, UserId } from '../value-objects/index.js';

export interface ThreadProps {
  id: ThreadId;
  title: ThreadTitle;
  body: ThreadBody;
  owner: UserId;
  createdAt: Date;
}

export class Thread {
  constructor(private readonly props: ThreadProps) {}

  get id(): ThreadId {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get body() {
    return this.props.body;
  }

  get owner() {
    return this.props.owner;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  // Factory methods
  static create(props: { id?: string; title: string; body: string; owner: string }): Thread {
    const now = new Date();

    return new Thread({
      id: ThreadId.create(props.id),
      title: ThreadTitle.create(props.title),
      body: ThreadBody.create(props.body),
      owner: UserId.create(props.owner),
      createdAt: now,
    });
  }

  static reconstitute(props: {
    id?: string;
    title: string;
    body: string;
    owner: string;
    createdAt: Date;
  }): Thread {
    return new Thread({
      id: ThreadId.create(props.id),
      title: ThreadTitle.create(props.title),
      body: ThreadBody.create(props.body),
      owner: UserId.create(props.owner),
      createdAt: props.createdAt,
    });
  }

  // For persistence
  toPersistence(): {
    id: string;
    title: string;
    body: string;
    owner: string;
    createdAt: Date;
  } {
    return {
      id: this.props.id.value,
      title: this.props.title.value,
      body: this.props.body.value,
      owner: this.props.owner.value,
      createdAt: this.props.createdAt,
    };
  }
}
