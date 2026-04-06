/* eslint-disable @typescript-eslint/no-unused-vars */
import * as express from 'express';

import type { AuthPayload } from './domains/index.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
