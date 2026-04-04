import { DomainError } from '../commons/domain-error.js';

export class Fullname {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value?.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new DomainError('fullname cannot be empty');
    }

    if (this._value.length < 2) {
      throw new DomainError('fullname must be at least 2 characters long');
    }

    if (this._value.length > 100) {
      throw new DomainError('fullname cannot exceed 100 characters');
    }

    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(this._value)) {
      throw new DomainError('fullname contains invalid characters');
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
