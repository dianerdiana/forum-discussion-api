import { DomainError } from '../commons/domain-error.js';

export class Fullname {
  private readonly _value: string;

  constructor(value: string) {
    if (typeof value !== 'string') {
      throw new DomainError('FULLNAME.NOT_STRING');
    }

    this._value = value.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new DomainError('FULLNAME.EMPTY');
    }

    if (this._value.length < 2) {
      throw new DomainError('FULLNAME.TOO_SHORT');
    }

    if (this._value.length > 100) {
      throw new DomainError('FULLNAME.TOO_LONG');
    }

    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(this._value)) {
      throw new DomainError('FULLNAME.INVALID_CHARACTER');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Fullname): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): Fullname {
    return new Fullname(value);
  }
}
