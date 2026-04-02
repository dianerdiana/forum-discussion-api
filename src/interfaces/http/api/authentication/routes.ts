import express from 'express';

import { ValidatorMiddleware } from '../../middleware/validator.middleware.js';

import type { AuthenticationHandler } from './handler.js';
import { authenticationSchema, loginSchema } from './schema.js';

export const createAuthenticationRouter = (handler: AuthenticationHandler) => {
  const router = express.Router();

  router.post(
    '/',
    ValidatorMiddleware.validateBody(loginSchema),
    handler.postAuthenticationHandler,
  );
  router.put(
    '/',
    ValidatorMiddleware.validateBody(authenticationSchema),
    handler.putAuthenticationHandler,
  );
  router.delete(
    '/',
    ValidatorMiddleware.validateBody(authenticationSchema),
    handler.deleteAuthenticationHandler,
  );

  return router;
};
