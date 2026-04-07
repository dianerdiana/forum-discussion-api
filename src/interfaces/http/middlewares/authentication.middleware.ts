import type { NextFunction, Request, Response } from 'express';
import type { Container } from 'instances-container';

import type { AuthenticationTokenManager } from '@/applications/index.js';

import { AuthenticationError, TOKENS_CONTAINER } from '@/commons/index.js';

export class AuthenticationMiddleware {
  private readonly container: Container;

  constructor({ container }: { container: Container }) {
    this.container = container;

    this.validateUser = this.validateUser.bind(this);
  }

  async validateUser(req: Request, _res: Response, next: NextFunction) {
    const jwtTokenManager = this.container.getInstance(
      TOKENS_CONTAINER.authenticationTokenManager,
    ) as AuthenticationTokenManager;

    const token = req.headers.authorization;

    if (token && token.indexOf('Bearer ') !== -1) {
      try {
        const bearerToken = token.split('Bearer ')[1] || '';
        const user = await jwtTokenManager.decodePayload(bearerToken);

        req.user = user;
        return next();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new AuthenticationError('Missing authentication');
      }
    }

    throw new AuthenticationError('Missing authentication');
  }
}
