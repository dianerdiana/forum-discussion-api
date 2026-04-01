import type { NextFunction, Request, Response } from 'express';
import type { Container } from 'instances-container';

import {
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshAuthenticationUseCase,
} from '@/applications/index.js';

export class AuthenticationHandler {
  private readonly container: Container;

  constructor(container: Container) {
    this.container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const loginUserUseCase = this.container.getInstance(LoginUserUseCase.name);
      const { accessToken, refreshToken } = await loginUserUseCase.execute(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshAuthenticationUseCase = this.container.getInstance(
        RefreshAuthenticationUseCase.name,
      );
      const accessToken = await refreshAuthenticationUseCase.execute(req.body);

      res.json({
        status: 'success',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const logoutUserUseCase = this.container.getInstance(LogoutUserUseCase.name);
      await logoutUserUseCase.execute(req.body);

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}
