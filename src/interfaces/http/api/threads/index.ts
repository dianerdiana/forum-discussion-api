import type { Container } from 'instances-container';

import { AuthenticationMiddleware } from '../../middlewares/index.js';

import { ThreadHandler } from './handler.js';
import { createThreadHandler } from './routes.js';

export default (container: Container) => {
  const threadHandler = new ThreadHandler(container);
  const authenticationMiddleware = new AuthenticationMiddleware({ container });

  return createThreadHandler({ handler: threadHandler, authenticationMiddleware });
};
