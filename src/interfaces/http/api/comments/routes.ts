import express from 'express';

import { AuthenticationMiddleware } from '../../middlewares/authentication.middleware.js';

import type { CommentHandler } from './handler.js';

export const createCommentHandler = ({
  handler,
  authenticationMiddleware,
}: {
  handler: CommentHandler;
  authenticationMiddleware: AuthenticationMiddleware;
}) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authenticationMiddleware.validateUser, handler.postCommentHandler);
  router.post(
    '/:commentId/replies',
    authenticationMiddleware.validateUser,
    handler.postReplyHandler,
  );
  router.delete('/:commentId', authenticationMiddleware.validateUser, handler.deleteCommentHandler);
  router.delete(
    '/:commentId/replies/:replyId',
    authenticationMiddleware.validateUser,
    handler.deleteReplyHandler,
  );

  return router;
};
