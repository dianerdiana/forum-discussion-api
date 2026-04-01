import { Fullname, Password, UserId, Username } from '../value-objects/index.js';

export interface UserProps {
  id: UserId;
  username: Username;
  fullname: Fullname;
  password: Password;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  get id(): UserId {
    return this.props.id;
  }

  get fullname(): Fullname {
    return this.props.fullname;
  }

  get username(): Username {
    return this.props.username;
  }

  get password(): Password {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  updateFullname(newFullname: Fullname): void {
    this.props.fullname = newFullname;
    this.props.updatedAt = new Date();
  }

  updateUsername(newUsername: Username): void {
    this.props.username = newUsername;
    this.props.updatedAt = new Date();
  }

  equals(other: User): boolean {
    return this.props.id.equals(other.props.id);
  }

  // Factory methods
  static create(props: {
    username: string;
    fullname: string;
    password: string;
    id?: string;
  }): User {
    const now = new Date();

    return new User({
      id: UserId.create(props.id),
      username: Username.create(props.username),
      fullname: Fullname.create(props.fullname),
      password: Password.create(props.password),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: {
    id: string;
    username: string;
    fullname: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: UserId.create(props.id),
      username: Username.create(props.username),
      fullname: Fullname.create(props.fullname),
      password: Password.create(props.password),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  // For persistence
  toPersistence(): {
    id: string;
    username: string;
    fullname: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.props.id.value,
      username: this.props.username.value,
      fullname: this.props.fullname.value,
      password: this.props.password.value,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
