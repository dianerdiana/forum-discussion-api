import { DomainError } from '../commons/index.js';

export class Token {
  private readonly _value: string;

  constructor(value: string) {
    if (typeof value !== 'string') {
      throw new DomainError('TOKEN.NOT_STRING');
    }

    this._value = value.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.trim().length === 0) {
      throw new DomainError('TOKEN.EMPTY');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Token): boolean {
    return this._value.toLowerCase() === other._value.toLowerCase();
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): Token {
    return new Token(value);
  }
}
