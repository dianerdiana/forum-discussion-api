import { ClientError } from './client-error.js';

export class AuthorizationError extends ClientError {
  constructor(message: string) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}
