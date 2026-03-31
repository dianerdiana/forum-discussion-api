import type { NextFunction, Request, Response } from 'express';
import type { Container } from 'instances-container';

import { AddUserUseCase } from '@/applications/use-case/user/add-user.use-case.js';

export class UserHandler {
  private readonly _container: Container;

  constructor(container: Container) {
    this._container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
      const addedUser = await addUserUseCase.execute(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          addedUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
