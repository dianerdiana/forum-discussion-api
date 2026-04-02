import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ClientError, DomainErrorTranslator } from '@/commons/index.js';

export const errorHandlerMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    if (error.issues.length) {
      const issue = error.issues[0];
      let message = 'Required';

      if (issue?.code === 'invalid_type') {
        message = `${issue.path} ${issue.expected}`;
      }

      return res.status(4000).json({
        status: 'fail',
        message: message,
      });
    }
  }

  // bila response tersebut error, tangani sesuai kebutuhan
  const translatedError = DomainErrorTranslator.translate(error);

  // penanganan client error secara internal.
  if (translatedError instanceof ClientError) {
    return res.status(translatedError.statusCode).json({
      status: 'fail',
      message: translatedError.message,
    });
  }

  // penanganan server error sesuai kebutuhan
  return res.status(500).json({
    status: 'error',
    message: 'terjadi kegagalan pada server kami',
  });
};
