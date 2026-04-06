import { DomainError } from '../commons/domain-error.js';

export class ThreadBody {
  private readonly _value: string;

  constructor(value: string) {
    if (typeof value !== 'string') {
      throw new DomainError('THREAD_BODY.NOT_STRING');
    }

    this._value = value.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new DomainError('THREAD_BODY.EMPTY');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: ThreadBody): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): ThreadBody {
    return new ThreadBody(value);
  }
}
