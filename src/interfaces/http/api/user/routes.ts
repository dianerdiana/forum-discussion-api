import express from 'express';

import { ValidatorMiddleware } from '../../middleware/validator.middleware.js';

import type { UserHandler } from './handler.js';
import { createUserSchema } from './schema.js';

export const createUserRouter = (handler: UserHandler) => {
  const router = express.Router();

  router.post('/', ValidatorMiddleware.validateBody(createUserSchema), handler.postUserHandler);

  return router;
};
