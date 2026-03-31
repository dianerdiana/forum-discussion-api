import express from 'express';

import type { AuthenticationHandler } from './handler.js';

export const createAuthenticationRouter = (handler: AuthenticationHandler) => {
  const router = express.Router();

  router.post('/', handler.postAuthenticationHandler);
  router.put('/', handler.putAuthenticationHandler);
  router.delete('/', handler.deleteAuthenticationHandler);

  return router;
};
