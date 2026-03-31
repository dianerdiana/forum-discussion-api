import type { Container } from 'instances-container';

import { UserHandler } from './handler.js';
import { createUserRouter } from './routes.js';

export default (container: Container) => {
  const userHandler = new UserHandler(container);
  return createUserRouter(userHandler);
};
