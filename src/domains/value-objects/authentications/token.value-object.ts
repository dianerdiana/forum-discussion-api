export class Token {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.trim().length === 0) {
      throw new Error('Token cannot be empty');
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
