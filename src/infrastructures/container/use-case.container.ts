import type { InstanceOption } from 'instances-container';

import {
  CreateCommentUseCase,
  CreateThreadUseCase,
  CreateUserUseCase,
  DeleteAuthenticationUseCase,
  DeleteCommentUseCase,
  GetDetailThreadUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshAuthenticationUseCase,
} from '@/applications/index.js';

import { TOKENS_CONTAINER } from '@/commons/index.js';

export const useCaseContainer: InstanceOption[] = [
  // User Use-Cases
  {
    key: CreateUserUseCase.name,
    Class: CreateUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: TOKENS_CONTAINER.userRepository,
        },
        {
          name: 'passwordHash',
          internal: TOKENS_CONTAINER.passwordHash,
        },
      ],
    },
  },

  // Authentication Use-Cases
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: TOKENS_CONTAINER.userRepository,
        },
        {
          name: 'authenticationRepository',
          internal: TOKENS_CONTAINER.authenticationRepository,
        },
        {
          name: 'authenticationTokenManager',
          internal: TOKENS_CONTAINER.authenticationTokenManager,
        },
        {
          name: 'passwordHash',
          internal: TOKENS_CONTAINER.passwordHash,
        },
      ],
    },
  },
  {
    key: DeleteAuthenticationUseCase.name,
    Class: DeleteAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationDomainService',
          internal: TOKENS_CONTAINER.authenticationDomainService,
        },
        {
          name: 'authenticationRepository',
          internal: TOKENS_CONTAINER.authenticationRepository,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationDomainService',
          internal: TOKENS_CONTAINER.authenticationDomainService,
        },
        {
          name: 'authenticationRepository',
          internal: TOKENS_CONTAINER.authenticationRepository,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationDomainService',
          internal: TOKENS_CONTAINER.authenticationDomainService,
        },
        {
          name: 'authenticationTokenManager',
          internal: TOKENS_CONTAINER.authenticationTokenManager,
        },
      ],
    },
  },

  // Thread Use-Cases
  {
    key: CreateThreadUseCase.name,
    Class: CreateThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: TOKENS_CONTAINER.threadRepository,
        },
        {
          name: 'userRepository',
          internal: TOKENS_CONTAINER.userRepository,
        },
      ],
    },
  },
  {
    key: GetDetailThreadUseCase.name,
    Class: GetDetailThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: TOKENS_CONTAINER.threadRepository,
        },
        {
          name: 'userRepository',
          internal: TOKENS_CONTAINER.userRepository,
        },
        {
          name: 'commentRepository',
          internal: TOKENS_CONTAINER.commentRepository,
        },
        {
          name: 'commentLikeRepository',
          internal: TOKENS_CONTAINER.commentLikeRepository,
        },
      ],
    },
  },

  // Comment Use-Cases
  {
    key: CreateCommentUseCase.name,
    Class: CreateCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: TOKENS_CONTAINER.threadRepository,
        },
        {
          name: 'userRepository',
          internal: TOKENS_CONTAINER.userRepository,
        },
        {
          name: 'commentRepository',
          internal: TOKENS_CONTAINER.commentRepository,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: TOKENS_CONTAINER.threadRepository,
        },
        {
          name: 'userRepository',
          internal: TOKENS_CONTAINER.userRepository,
        },
        {
          name: 'commentRepository',
          internal: TOKENS_CONTAINER.commentRepository,
        },
      ],
    },
  },
];
