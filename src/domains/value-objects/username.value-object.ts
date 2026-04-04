import { DomainError } from '../commons/domain-error.js';

export class Username {
  private readonly _value: string;

  constructor(value: string) {
    if (typeof value !== 'string') {
      throw new DomainError('USERNAME.NOT_STRING');
    }

    this._value = value.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new DomainError('USERNAME.EMPTY');
    }

    if (this._value.length < 2) {
      throw new DomainError('USERNAME.TOO_SHORT');
    }

    if (this._value.length > 50) {
      throw new DomainError('USERNAME.TOO_LONG');
    }

    // Allow only alphanumeric characters and underscores (no spaces)
    const usernameRegex = /^[\w]+$/;
    if (!usernameRegex.test(this._value)) {
      throw new DomainError('USERNAME.INVALID_CHARACTER');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Username): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): Username {
    return new Username(value);
  }
}
