import type { Container } from 'instances-container';

import { AuthenticationMiddleware } from '../../middlewares/index.js';

import { CommentHandler } from './handler.js';
import { createCommentHandler } from './routes.js';

export default (container: Container) => {
  const threadHandler = new CommentHandler(container);
  const authenticationMiddleware = new AuthenticationMiddleware({ container });

  return createCommentHandler({ handler: threadHandler, authenticationMiddleware });
};
