import { DomainError } from '../commons/domain-error.js';

export class CommentContent {
  private readonly _value: string;

  constructor(value: string) {
    if (typeof value !== 'string') {
      throw new DomainError('COMMENT_CONTENT.NOT_STRING');
    }

    this._value = value.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new DomainError('COMMENT_CONTENT.EMPTY');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: CommentContent): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): CommentContent {
    return new CommentContent(value);
  }
}
