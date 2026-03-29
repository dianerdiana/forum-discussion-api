import * as jwt from 'jsonwebtoken';

export class JwtAdapter {
  sign(payload: object, secret: string, options?: object) {
    return jwt.sign(payload, secret, options);
  }

  verify(token: string, secret: string) {
    return jwt.verify(token, secret);
  }

  decode(token: string) {
    return jwt.decode(token);
  }
}
