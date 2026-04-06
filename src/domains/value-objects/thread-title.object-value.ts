import { DomainError } from '../commons/domain-error.js';

export class ThreadTitle {
  private readonly _value: string;

  constructor(value: string) {
    if (typeof value !== 'string') {
      throw new DomainError('THREAD_TITLE.NOT_STRING');
    }

    this._value = value.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new DomainError('THREAD_TITLE.EMPTY');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: ThreadTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): ThreadTitle {
    return new ThreadTitle(value);
  }
}
