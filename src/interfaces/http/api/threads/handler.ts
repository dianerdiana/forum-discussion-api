import type { NextFunction, Request, Response } from 'express';
import type { Container } from 'instances-container';

import { type CreateThreadDto, CreateThreadUseCase } from '@/applications/index.js';

import { RESPONSE_STATUS } from '@/commons/index.js';

import type { AuthPayload } from '@/domains/index.js';

export class ThreadHandler {
  private readonly container: Container;

  constructor(container: Container) {
    this.container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthPayload;
      const payload = req.body as Omit<CreateThreadDto, 'owner'>;
      const createThreadUseCase = this.container.getInstance(
        CreateThreadUseCase.name,
      ) as CreateThreadUseCase;
      const response = await createThreadUseCase.execute({
        ...payload,
        owner: user.userId,
      });

      res.status(201).json({
        status: RESPONSE_STATUS.success,
        data: {
          addedThread: response,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
