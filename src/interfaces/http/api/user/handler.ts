import type { NextFunction, Request, Response } from 'express';
import type { Container } from 'instances-container';

import { CreateUserUseCase } from '@/applications/index.js';

import { RESPONSE_STATUS } from '@/commons/index.js';

export class UserHandler {
  private readonly container: Container;

  constructor(container: Container) {
    this.container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const addUserUseCase = this.container.getInstance(CreateUserUseCase.name);
      const addedUser = await addUserUseCase.execute(req.body);

      res.status(201).json({
        status: RESPONSE_STATUS.success,
        data: {
          addedUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
