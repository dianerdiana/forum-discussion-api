import type { DomainErrorCode } from '../constants/domain-error-codes.constant.js';

import { AuthorizationError } from './authorization-error.js';
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
  'FULLNAME.NOT_STRING': new InvariantError('fullname harus berupa string'),
  'FULLNAME.EMPTY': new InvariantError('fullname tidak boleh kosong'),
  'FULLNAME.TOO_SHORT': new InvariantError('fullname harus diisi minimal 2 karakter'),
  'FULLNAME.TOO_LONG': new InvariantError('fullname tidak boleh lebih dari 100 karakter'),
  'FULLNAME.INVALID_CHARACTER': new InvariantError('fullname mengandung karakter yang tidak valid'),

  'PASSWORD.NOT_STRING': new InvariantError('password harus berupa string'),
  'PASSWORD.EMPTY': new InvariantError('password tidak boleh kosong'),
  'PASSWORD.TOO_SHORT': new InvariantError('password harus diisi minimal 6 karakter'),

  'TOKEN.NOT_STRING': new InvariantError('token harus berupa string'),
  'TOKEN.EMPTY': new InvariantError('token tidak boleh kosong'),

  'USERNAME.NOT_STRING': new InvariantError('username harus berupa string'),
  'USERNAME.EMPTY': new InvariantError('username tidak boleh kosong'),
  'USERNAME.TOO_SHORT': new InvariantError('username harus diisi minimal 2 karakter'),
  'USERNAME.TOO_LONG': new InvariantError('username tidak boleh lebih dari 50 karakter'),
  'USERNAME.INVALID_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USERNAME.NOT_AVAILABLE': new InvariantError('username tidak tersedia'),
  'USERNAME_AND_PASSWORD.EMPTY': new InvariantError('username and password tidak boleh kosong'),

  'USER_ID.EMPTY': new InvariantError('user id tidak boleh kosong'),
  'AUTH_USER.NOT_FOUND': new InvariantError('kredensial yang Anda masukkan salah'),

  'REFRESH_TOKEN.NOT_REGISTERED': new InvariantError('refresh token tidak ditemukan di database'),
  'REFRESH_TOKEN.EMPTY': new InvariantError('refresh token tidak boleh kosong'),
  'REFRESH_TOKEN.NOT_STRING': new InvariantError('refresh token harus berupa string'),

  'THREAD_ID.EMPTY': new InvariantError('thread id tidak boleh kosong'),
  'THREAD_BODY.NOT_STRING': new InvariantError('body harus berupa string'),
  'THREAD_BODY.EMPTY': new InvariantError('body harus berupa string'),
  'THREAD_TITLE.NOT_STRING': new InvariantError('title harus berupa string'),
  'THREAD_TITLE.EMPTY': new InvariantError('title harus berupa string'),

  'COMMENT_ID.EMPTY': new InvariantError('comment id tidak boleh kosong'),
  'COMMENT_CONTENT.NOT_STRING': new InvariantError('content harus berupa string'),
  'COMMENT_CONTENT.EMPTY': new InvariantError('content harus berupa string'),

  'USER.NOT_FOUND': new InvariantError('user tidak ditemukan'),
  'DELETE_COMMENT.FORBIDDEN': new AuthorizationError('Anda tidak memiliki izin untuk menghapus komentari ini.'),
  'COMMENT_LIKE_ID.EMPTY': new InvariantError('comment id tidak boleh kosong'),
};

export { DomainErrorTranslator };
