import { vi } from 'vitest';

import { InvariantError } from '@/commons/index.js';

import { Authentication } from '@/domains/index.js';

import { db } from '@/infrastructures/database/index.js';

import { AuthenticationsTableTestHelper } from '@/tests/index.js';

import { PostgresAuthenticationRepository } from '../postgres-authentication.repository.js';

describe('PostgresAuthenticationRepository', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('save', () => {
    it('should add token to database', async () => {
      // Arrange
      const authenticationRepository = new PostgresAuthenticationRepository(db);
      const payload = Authentication.create({ token: 'refresh_token' });

      // Action
      const result = await authenticationRepository.save(payload);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken('refresh_token');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toMatchObject({ token: 'refresh_token' });
      expect(result.token.value).toBe('refresh_token');
    });

    it('should throw InvariantError when database returns no rows', async () => {
      // Arrange
      const authenticationRepository = new PostgresAuthenticationRepository(db);
      const newAuth = Authentication.create({ token: 'refresh_token' });

      vi.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: [],
      });

      // Action & Assert
      await expect(authenticationRepository.save(newAuth)).rejects.toThrow(InvariantError);
    });
  });

  describe('existsByToken', () => {
    it('should return false when token is not available', async () => {
      // Arrange
      const authenticationRepository = new PostgresAuthenticationRepository(db);

      // Action
      const result = await authenticationRepository.existsByToken('unknown_token');

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when token is available', async () => {
      // Arrange
      const authenticationRepository = new PostgresAuthenticationRepository(db);
      await AuthenticationsTableTestHelper.addToken('refresh_token');

      // Action
      const result = await authenticationRepository.existsByToken('refresh_token');

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('deleteToken', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepository = new PostgresAuthenticationRepository(db);
      await AuthenticationsTableTestHelper.addToken('refresh_token');

      // Action
      await authenticationRepository.deleteToken('refresh_token');

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken('refresh_token');
      expect(tokens).toHaveLength(0);
    });

    it('should not fail when deleting non-existing token', async () => {
      // Arrange
      const authenticationRepository = new PostgresAuthenticationRepository(db);

      // Action & Assert
      await expect(authenticationRepository.deleteToken('unknown_token')).resolves.toBeUndefined();
    });
  });
});
