import express from 'express';

import type { UserHandler } from './handler.js';

export const createUserRouter = (handler: UserHandler) => {
  const router = express.Router();

  router.post('/', handler.postUserHandler);

  return router;
};
