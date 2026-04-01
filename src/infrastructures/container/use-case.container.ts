import type { InstanceOption } from 'instances-container';

import {
  CreateUserUseCase,
  DeleteAuthenticationUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshAuthenticationUseCase,
} from '@/applications/index.js';

import { TOKENS_CONTAINER } from '@/commons/index.js';

export const useCaseContainer: InstanceOption[] = [
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
];
