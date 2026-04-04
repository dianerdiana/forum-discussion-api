import { DomainErrorTranslator } from '../domain-error-translator.js';
import { InvariantError } from '../invariant-error.js';

describe('DomainErrorTranslator', () => {
  // prettier-ignore
  it('should translate FULLNAME errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.NOT_STRING'))).toStrictEqual(new InvariantError('fullname must be a string'));
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.EMPTY'))).toStrictEqual(new InvariantError('fullname cannot be empty'));
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.TOO_SHORT'))).toStrictEqual(new InvariantError('fullname must be at least 2 characters long'));
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.TOO_LONG'))).toStrictEqual(new InvariantError('fullname cannot exceed 100 characters'));
    expect(DomainErrorTranslator.translate(new Error('FULLNAME.INVALID_CHARACTER'))).toStrictEqual(new InvariantError('fullname contains invalid characters'));
  });

  // prettier-ignore
  it('should translate PASSWORD errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('PASSWORD.NOT_STRING'))).toStrictEqual(new InvariantError('password must be a string'));
    expect(DomainErrorTranslator.translate(new Error('PASSWORD.EMPTY'))).toStrictEqual(new InvariantError('password cannot be empty'));
    expect(DomainErrorTranslator.translate(new Error('PASSWORD.TOO_SHORT'))).toStrictEqual(new InvariantError('password must be at least 6 characters long'));
  });

  // prettier-ignore
  it('should translate TOKEN errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('TOKEN.NOT_STRING'))).toStrictEqual(new InvariantError('token must be a string'));
    expect(DomainErrorTranslator.translate(new Error('TOKEN.EMPTY'))).toStrictEqual(new InvariantError('token cannot be empty'));
  });

  // prettier-ignore
  it('should translate USERNAME errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('USERNAME.NOT_STRING'))).toStrictEqual(new InvariantError('username must be a string'));
    expect(DomainErrorTranslator.translate(new Error('USERNAME.EMPTY'))).toStrictEqual(new InvariantError('username cannot be empty'));
    expect(DomainErrorTranslator.translate(new Error('USERNAME.TOO_SHORT'))).toStrictEqual(new InvariantError('username must be at least 2 characters long'));
    expect(DomainErrorTranslator.translate(new Error('USERNAME.TOO_LONG'))).toStrictEqual(new InvariantError('username cannot exceed 50 characters'));
    expect(DomainErrorTranslator.translate(new Error('USERNAME.INVALID_CHARACTER'))).toStrictEqual(new InvariantError('username contains invalid characters'));
  });

  // prettier-ignore
  it('should translate USER_ID errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('USER_ID.EMPTY'))).toStrictEqual(new InvariantError('user id cannot be empty'));
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
