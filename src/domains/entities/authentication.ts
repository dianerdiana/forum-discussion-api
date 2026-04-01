import { Token } from '../value-objects/index.js';

export interface AuthenticationProps {
  token: Token;
}

export class Authentication {
  constructor(public readonly props: AuthenticationProps) {}

  get token(): Token {
    return this.props.token;
  }

  // Factory methods
  static create(props: { token: string }): Authentication {
    return new Authentication({ token: Token.create(props.token) });
  }

  static reconstitute(props: { token: string }): Authentication {
    return new Authentication({
      token: Token.create(props.token),
    });
  }

  // For persistence
  toPersistence(): { token: string } {
    return {
      token: this.props.token.value,
    };
  }
}
