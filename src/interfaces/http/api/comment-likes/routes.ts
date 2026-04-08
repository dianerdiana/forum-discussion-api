import express from 'express';

import { AuthenticationMiddleware } from '../../middlewares/authentication.middleware.js';

import type { CommentLikeHandler } from './handler.js';

export const createCommentLikeHandler = ({
  handler,
  authenticationMiddleware,
}: {
  handler: CommentLikeHandler;
  authenticationMiddleware: AuthenticationMiddleware;
}) => {
  const router = express.Router({ mergeParams: true });

  router.put('/', authenticationMiddleware.validateUser, handler.performCommentLike);

  return router;
};
