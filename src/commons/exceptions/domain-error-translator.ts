import type { DomainErrorCode } from '../constants/domain-error-codes.constant.js';

import { InvariantError } from './invariant-error.js';

type DomainErrorTranslatorType = {
  _directories: Record<DomainErrorCode, InvariantError>;
  translate: (error: Error) => InvariantError | Error;
};

const DomainErrorTranslator: DomainErrorTranslatorType = {
  _directories: {} as Record<DomainErrorCode, InvariantError>,

  translate(error: Error): InvariantError | Error {
    return this._directories[error.message as DomainErrorCode] || error;
  },
};

// prettier-ignore
DomainErrorTranslator._directories = {
  'FULLNAME.NOT_STRING': new InvariantError('fullname must be a string'),
  'FULLNAME.EMPTY': new InvariantError('fullname cannot be empty'),
  'FULLNAME.TOO_SHORT': new InvariantError('fullname must be at least 2 characters long'),
  'FULLNAME.TOO_LONG': new InvariantError('fullname cannot exceed 100 characters'),
  'FULLNAME.INVALID_CHARACTER': new InvariantError('fullname contains invalid characters'),

  'PASSWORD.NOT_STRING': new InvariantError('password must be a string'),
  'PASSWORD.EMPTY': new InvariantError('password cannot be empty'),
  'PASSWORD.TOO_SHORT': new InvariantError('password must be at least 6 characters long'),

  'TOKEN.NOT_STRING': new InvariantError('token must be a string'),
  'TOKEN.EMPTY': new InvariantError('token cannot be empty'),

  'USERNAME.NOT_STRING': new InvariantError('username must be a string'),
  'USERNAME.EMPTY': new InvariantError('username cannot be empty'),
  'USERNAME.TOO_SHORT': new InvariantError('username must be at least 2 characters long'),
  'USERNAME.TOO_LONG': new InvariantError('username cannot exceed 50 characters'),
  'USERNAME.INVALID_CHARACTER': new InvariantError('username contains invalid characters'),

  'USER_ID.EMPTY': new InvariantError('user id cannot be empty'),
};

export { DomainErrorTranslator };
