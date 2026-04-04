import express, { type NextFunction, type Request, type Response } from 'express';
import type { Container } from 'instances-container';

import { ClientError, DomainErrorTranslator } from '@/commons/index.js';

import authentication from '@/interfaces/http/api/authentication/index.js';
import user from '@/interfaces/http/api/user/index.js';

export const createServer = async (container: Container) => {
  const app = express();

  // Middleware for parsing JSON
  app.use(express.json());

  // Register routes
  app.use('/users', user(container));
  app.use('/authentications', authentication(container));

  // Global error handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
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
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};
