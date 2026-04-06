import type { Container } from 'instances-container';

import { AuthenticationHandler } from './handler.js';
import { createAuthenticationRouter } from './routes.js';

export default (container: Container) => {
  const authenticationHandler = new AuthenticationHandler(container);
  return createAuthenticationRouter(authenticationHandler);
};
