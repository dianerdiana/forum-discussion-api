import type { NextFunction, Request, Response } from 'express';
import type { Container } from 'instances-container';

import { LoginUserUseCase } from '@/applications/use-case/authentication/login-user.use-case.js';
import { LogoutUserUseCase } from '@/applications/use-case/authentication/logout-user.use-case.js';
import { RefreshAuthenticationUseCase } from '@/applications/use-case/authentication/refresh-authentication.use-case.js';

export class AuthenticationHandler {
  private readonly _container: Container;

  constructor(container: Container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
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
      const refreshAuthenticationUseCase = this._container.getInstance(
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
      const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase.name);
      await logoutUserUseCase.execute(req.body);

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}
