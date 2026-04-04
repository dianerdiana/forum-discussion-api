import { DomainError } from '../commons/domain-error.js';

export class Password {
  private readonly _value: string;

  constructor(value: string) {
    if (typeof value !== 'string') {
      throw new DomainError('PASSWORD.NOT_STRING');
    }

    this._value = value.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new DomainError('PASSWORD.EMPTY');
    }

    if (this._value.length < 6) {
      throw new DomainError('PASSWORD.TOO_SHORT');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Password): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): Password {
    return new Password(value);
  }
}
