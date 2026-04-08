import type { NextFunction, Request, Response } from 'express';
import type { Container } from 'instances-container';

import { PerformCommentLikeUseCase } from '@/applications/index.js';

import { RESPONSE_STATUS } from '@/commons/index.js';

import type { AuthPayload } from '@/domains/index.js';

export class CommentLikeHandler {
  private readonly container: Container;

  constructor(container: Container) {
    this.container = container;

    this.performCommentLike = this.performCommentLike.bind(this);
  }

  async performCommentLike(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthPayload;
      const threadId = req.params.threadId as string;
      const commentId = req.params.commentId as string;

      const performCommentLikeUseCase = this.container.getInstance(
        PerformCommentLikeUseCase.name,
      ) as PerformCommentLikeUseCase;

      const result = await performCommentLikeUseCase.execute({
        threadId,
        commentId: commentId,
        userId: user.userId,
      });

      res.status(200).json({
        status: RESPONSE_STATUS.success,
        data: {
          addedReply: result,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
