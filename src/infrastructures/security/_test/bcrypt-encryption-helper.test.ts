import bcrypt from 'bcrypt';
import { vi } from 'vitest';

import { AuthenticationError } from '@/commons/exceptions/authentication-error.js';

import { BcryptPasswordHash } from '../bcrypt-password-hash.js';

describe('BcryptPasswordHash', () => {
  describe('encryptPassword function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = vi.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Act & Assert
      await expect(
        bcryptPasswordHash.comparePassword('plain_password', 'encrypted_password'),
      ).rejects.toThrow(AuthenticationError);
    });

    it('should not return AuthenticationError if password match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'secret';
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Act & Assert
      await expect(
        bcryptPasswordHash.comparePassword(plainPassword, encryptedPassword),
      ).resolves.not.toThrow(AuthenticationError);
    });
  });
});
