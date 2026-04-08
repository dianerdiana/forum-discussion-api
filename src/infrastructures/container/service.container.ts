import bcrypt from 'bcrypt';
import type { InstanceOption } from 'instances-container';

import config from '@/commons/config.js';
import { TOKENS_CONTAINER } from '@/commons/index.js';

import { AuthenticationDomainService } from '@/domains/index.js';

import {
  PostgresAuthenticationRepository,
  PostgresCommentLikeRepository,
  PostgresCommentRepository,
  PostgresThreadRepository,
  PostgresUserRepository,
} from '@/infrastructures/repositories/index.js';
import {
  BcryptPasswordHash,
  JwtAdapter,
  JwtTokenManager,
} from '@/infrastructures/security/index.js';

import { Database } from '../database/postgres.js';

export const serviceContainer: InstanceOption[] = [
  // Database
  {
    key: TOKENS_CONTAINER.database,
    Class: Database,
    parameter: {
      dependencies: [
        {
          concrete: config.database,
        },
      ],
    },
  },
  {
    key: JwtAdapter.name,
    Class: JwtAdapter,
  },

  // Repositories
  {
    key: TOKENS_CONTAINER.userRepository,
    Class: PostgresUserRepository,
    parameter: {
      dependencies: [
        {
          name: 'db',
          internal: TOKENS_CONTAINER.database,
        },
      ],
    },
  },
  {
    key: TOKENS_CONTAINER.authenticationRepository,
    Class: PostgresAuthenticationRepository,
    parameter: {
      dependencies: [
        {
          name: 'db',
          internal: TOKENS_CONTAINER.database,
        },
      ],
    },
  },
  {
    key: TOKENS_CONTAINER.commentRepository,
    Class: PostgresCommentRepository,
    parameter: {
      dependencies: [
        {
          name: 'db',
          internal: TOKENS_CONTAINER.database,
        },
      ],
    },
  },
  {
    key: TOKENS_CONTAINER.threadRepository,
    Class: PostgresThreadRepository,
    parameter: {
      dependencies: [
        {
          name: 'db',
          internal: TOKENS_CONTAINER.database,
        },
      ],
    },
  },

  {
    key: TOKENS_CONTAINER.commentLikeRepository,
    Class: PostgresCommentLikeRepository,
    parameter: {
      dependencies: [
        {
          name: 'db',
          internal: TOKENS_CONTAINER.database,
        },
      ],
    },
  },

  // Services
  {
    key: TOKENS_CONTAINER.authenticationDomainService,
    Class: AuthenticationDomainService,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: TOKENS_CONTAINER.authenticationRepository,
        },
      ],
    },
  },
  {
    key: TOKENS_CONTAINER.passwordHash,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: TOKENS_CONTAINER.authenticationTokenManager,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          name: 'jwtAdapter',
          internal: JwtAdapter.name,
        },
      ],
    },
  },
];
