import type { NextFunction, Request, Response } from 'express';
import type { Container } from 'instances-container';

import {
  type CreateThreadDto,
  CreateThreadUseCase,
  GetDetailThreadUseCase,
} from '@/applications/index.js';

import { RESPONSE_STATUS } from '@/commons/index.js';

import type { AuthPayload } from '@/domains/index.js';

export class ThreadHandler {
  private readonly container: Container;

  constructor(container: Container) {
    this.container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThread = this.getDetailThread.bind(this);
  }

  async postThreadHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthPayload;
      const payload = req.body as Omit<CreateThreadDto, 'owner'>;

      const createThreadUseCase = this.container.getInstance(
        CreateThreadUseCase.name,
      ) as CreateThreadUseCase;

      const result = await createThreadUseCase.execute({
        ...payload,
        owner: user.userId,
      });

      res.status(201).json({
        status: RESPONSE_STATUS.success,
        data: {
          addedThread: result,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getDetailThread(req: Request, res: Response, next: NextFunction) {
    try {
      const threadId = req.params.threadId as string;

      const getDetailThreadUseCase = this.container.getInstance(
        GetDetailThreadUseCase.name,
      ) as GetDetailThreadUseCase;

      const result = await getDetailThreadUseCase.execute(threadId);

      res.status(200).json({
        status: RESPONSE_STATUS.success,
        data: {
          thread: result,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
