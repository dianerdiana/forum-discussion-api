import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

import { InvariantError } from '@/commons/index.js';
export class ValidatorMiddleware {
  static validateBody(schema: ZodType) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      const parsed = await schema.safeParseAsync(req.body);

      if (!parsed.success) {
        console.log(parsed.error.issues);
        next(new InvariantError(parsed.error.issues[0]?.message || 'Bad Request'));
        return;
      }

      req.body = parsed.data;

      next();
    };
  }

  static validateParam(schema: ZodType) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      const parsed = await schema.safeParseAsync(req.params);

      if (!parsed.success) {
        next(new InvariantError(parsed.error.issues[0]?.message || 'Bad Request'));
        return;
      }

      req.body = parsed.data;

      next();
    };
  }

  static validateQuery(schema: ZodType) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      const parsed = await schema.safeParseAsync(req.query);

      if (!parsed.success) {
        next(new InvariantError(parsed.error.issues[0]?.message || 'Bad Request'));
        return;
      }

      req.body = parsed.data;

      next();
    };
  }
}
