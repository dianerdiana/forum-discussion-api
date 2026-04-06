import { DomainErrorTranslator } from '../domain-error-translator.js';
import { InvariantError } from '../invariant-error.js';

describe('DomainErrorTranslator', () => {
  // prettier-ignore
  it('should translate FULLNAME errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.NOT_STRING'))).toStrictEqual(new InvariantError('fullname harus berupa string'));
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.EMPTY'))).toStrictEqual(new InvariantError('fullname tidak boleh kosong'));
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.TOO_SHORT'))).toStrictEqual(new InvariantError('fullname harus diisi minimal 2 karakter'));
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.TOO_LONG'))).toStrictEqual(new InvariantError('fullname tidak boleh lebih dari 100 karakter'));
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.INVALID_CHARACTER'))).toStrictEqual(new InvariantError('fullname mengandung karakter yang tidak valid'));
  });

  // prettier-ignore
  it('should translate PASSWORD errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('PASSWORD.NOT_STRING'))).toStrictEqual(new InvariantError('password harus berupa string'));
    expect(DomainErrorTranslator.translate(new Error('PASSWORD.EMPTY'))).toStrictEqual(new InvariantError('password tidak boleh kosong'));
    expect(DomainErrorTranslator.translate(new Error('PASSWORD.TOO_SHORT'))).toStrictEqual(new InvariantError('password harus diisi minimal 6 karakter'));
  });

  // prettier-ignore
  it('should translate TOKEN errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('TOKEN.NOT_STRING'))).toStrictEqual(new InvariantError('token harus berupa string'));
    expect(DomainErrorTranslator.translate(new Error('TOKEN.EMPTY'))).toStrictEqual(new InvariantError('token tidak boleh kosong'));
  });

  // prettier-ignore
  it('should translate USERNAME errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('USERNAME.NOT_STRING'))).toStrictEqual(new InvariantError('username harus berupa string'));
    expect(DomainErrorTranslator.translate(new Error('USERNAME.EMPTY'))).toStrictEqual(new InvariantError('username tidak boleh kosong'));
    expect(DomainErrorTranslator.translate(new Error('USERNAME.TOO_SHORT'))).toStrictEqual(new InvariantError('username harus diisi minimal 2 karakter'));
    expect(DomainErrorTranslator.translate(new Error('USERNAME.TOO_LONG'))).toStrictEqual(new InvariantError('username tidak boleh lebih dari 50 karakter'));
    expect(DomainErrorTranslator.translate(new Error('USERNAME.INVALID_CHARACTER'))).toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
  });

  // prettier-ignore
  it('should translate USER_ID errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('USER_ID.EMPTY'))).toStrictEqual(new InvariantError('user id tidak boleh kosong'));
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
