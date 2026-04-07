import express from 'express';

import { AuthenticationMiddleware } from '../../middlewares/authentication.middleware.js';

import type { ThreadHandler } from './handler.js';

export const createThreadHandler = ({
  handler,
  authenticationMiddleware,
}: {
  handler: ThreadHandler;
  authenticationMiddleware: AuthenticationMiddleware;
}) => {
  const router = express.Router();

  router.post('/', authenticationMiddleware.validateUser, handler.postThreadHandler);
  router.get('/:threadId', handler.getDetailThread);

  return router;
};
