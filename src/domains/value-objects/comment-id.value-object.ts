import { v7 as uuidv7 } from 'uuid';

import { DomainError } from '../commons/domain-error.js';

export class CommentId {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? uuidv7();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.trim().length === 0) {
      throw new DomainError('COMMENT_ID.EMPTY');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: CommentId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value?: string): CommentId {
    return new CommentId(value);
  }
}
