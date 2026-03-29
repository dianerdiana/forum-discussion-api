import { ClientError } from './client-error.js';

export class AuthenticationError extends ClientError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}
