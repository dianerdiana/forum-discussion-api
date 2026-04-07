import type { NextFunction, Request, Response } from 'express';
import type { Container } from 'instances-container';

import { CreateCommentUseCase, DeleteCommentUseCase } from '@/applications/index.js';

import { RESPONSE_STATUS } from '@/commons/index.js';

import type { AuthPayload } from '@/domains/index.js';

export class CommentHandler {
  private readonly container: Container;

  constructor(container: Container) {
    this.container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postCommentHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthPayload;
      const threadId = req.params.threadId as string;
      const content = req.body.content;

      const createCommentUseCase = this.container.getInstance(
        CreateCommentUseCase.name,
      ) as CreateCommentUseCase;

      const result = await createCommentUseCase.execute({
        threadId,
        userId: user.userId,
        content,
      });

      res.status(201).json({
        status: RESPONSE_STATUS.success,
        data: {
          addedComment: result,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async postReplyHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthPayload;
      const threadId = req.params.threadId as string;
      const commentId = req.params.commentId as string;
      const content = req.body.content;

      const createCommentUseCase = this.container.getInstance(
        CreateCommentUseCase.name,
      ) as CreateCommentUseCase;

      const result = await createCommentUseCase.execute({
        threadId,
        userId: user.userId,
        parentId: commentId,
        content,
      });

      res.status(201).json({
        status: RESPONSE_STATUS.success,
        data: {
          addedReply: result,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthPayload;
      const threadId = req.params.threadId as string;
      const commentId = req.params.commentId as string;

      const deleteCommentUseCase = this.container.getInstance(
        DeleteCommentUseCase.name,
      ) as DeleteCommentUseCase;

      await deleteCommentUseCase.execute({
        id: commentId,
        threadId,
        userId: user.userId,
      });

      res.status(200).json({
        status: RESPONSE_STATUS.success,
        message: 'berhasil menghapus komentar',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReplyHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthPayload;
      const threadId = req.params.threadId as string;
      const commentId = req.params.commentId as string;
      const replyId = req.params.replyId as string;

      const deleteCommentUseCase = this.container.getInstance(
        DeleteCommentUseCase.name,
      ) as DeleteCommentUseCase;

      await deleteCommentUseCase.execute({
        id: replyId,
        parentId: commentId,
        threadId,
        userId: user.userId,
      });

      res.status(200).json({
        status: RESPONSE_STATUS.success,
        message: 'berhasil menghapus komentar',
      });
    } catch (error) {
      next(error);
    }
  }
}
