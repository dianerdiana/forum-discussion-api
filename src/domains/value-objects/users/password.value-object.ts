export class Password {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value?.trim();
    this.validate();
  }

  private validate(): void {
    if (!this._value || this._value.length === 0) {
      throw new Error('Password cannot be empty');
    }

    if (this._value.length < 6) {
      throw new Error('Password must be at least 6 characters long');
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
