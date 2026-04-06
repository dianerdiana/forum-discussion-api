import { DomainError } from '@/domains/commons/index.js';
import { Token } from '@/domains/value-objects/index.js';

import { Authentication } from '../authentication.js';

describe('Authentication', () => {
  describe('create', () => {
    it('should create an Authentication entity with a valid token', () => {
      // Arrange
      const token = 'valid_refresh_token';

      // Action
      const authentication = Authentication.create({ token });

      // Assert
      expect(authentication).toBeInstanceOf(Authentication);
      expect(authentication.token).toBeInstanceOf(Token);
      expect(authentication.token.value).toBe(token);
    });

    it('should throw DomainError when token is empty', () => {
      // Arrange
      const token = '';

      // Action & Assert
      expect(() => Authentication.create({ token })).toThrow(DomainError);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute an Authentication entity from persistence data', () => {
      // Arrange
      const token = 'persisted_refresh_token';

      // Action
      const authentication = Authentication.reconstitute({ token });

      // Assert
      expect(authentication).toBeInstanceOf(Authentication);
      expect(authentication.token).toBeInstanceOf(Token);
      expect(authentication.token.value).toBe(token);
    });
  });

  describe('toPersistence', () => {
    it('should return a plain object with token string', () => {
      // Arrange
      const token = 'valid_refresh_token';
      const authentication = Authentication.create({ token });

      // Action
      const result = authentication.toPersistence();

      // Assert
      expect(result).toStrictEqual({ token: 'valid_refresh_token' });
    });
  });
});
