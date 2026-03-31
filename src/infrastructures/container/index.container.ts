/* istanbul ignore file */

import bcrypt from 'bcrypt';
import { createContainer } from 'instances-container';

import { AuthenticationTokenManager } from '@/applications/security/authentication-token-manager.js';
import { PasswordHash } from '@/applications/security/password-hash.js';
import { LoginUserUseCase } from '@/applications/use-case/authentication/login-user.use-case.js';
import { LogoutUserUseCase } from '@/applications/use-case/authentication/logout-user.use-case.js';
import { RefreshAuthenticationUseCase } from '@/applications/use-case/authentication/refresh-authentication.use-case.js';
import { AddUserUseCase } from '@/applications/use-case/user/add-user.use-case.js';

import { AuthenticationRepository } from '@/domains/authentication/repository/authentication.repository.js';
import { UserRepository } from '@/domains/user/repository/user.repository.js';

import { JwtAdapter } from '@/infrastructures/security/jwt-adapter.js';
import { UuidGenerator } from '@/infrastructures/security/uuid-generator.js';

import { db } from '../database/postgres/db.js';
import { AuthenticationRepositoryPostgres } from '../repository/authentication-postgres.repository.js';
import { UserRepositoryPostgres } from '../repository/user-postgres.repository.js';
import { BcryptPasswordHash } from '../security/bcrypt-password-hash.js';
import { JwtTokenManager } from '../security/jwt-token-manager.js';

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UuidGenerator.name,
    Class: UuidGenerator,
  },
  {
    key: JwtAdapter.name,
    Class: JwtAdapter,
  },
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: db,
        },
        {
          name: 'idGenerator',
          internal: UuidGenerator.name,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: db,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
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
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          name: 'jwt',
          internal: JwtAdapter.name,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
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
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
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
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
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
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
]);

export { container };
