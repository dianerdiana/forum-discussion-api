import type { Container } from 'instances-container';

import { AuthenticationMiddleware } from '../../middlewares/index.js';

import { CommentLikeHandler } from './handler.js';
import { createCommentLikeHandler } from './routes.js';

export default (container: Container) => {
  const threadHandler = new CommentLikeHandler(container);
  const authenticationMiddleware = new AuthenticationMiddleware({ container });

  return createCommentLikeHandler({ handler: threadHandler, authenticationMiddleware });
};
