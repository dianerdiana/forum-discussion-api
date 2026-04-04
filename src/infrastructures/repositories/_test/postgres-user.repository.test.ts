import { User, UserId, Username } from '@/domains/index.js';

import { db } from '@/infrastructures/database/index.js';

import { UsersTableTestHelper } from '@/tests/index.js';

import { PostgresUserRepository } from '../postgres-user.repository.js';

describe('PostgresUserRepository', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('save', () => {
    it('should persist a new user into database', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);
      const newUser = User.create({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      });

      // Action
      await userRepository.save(newUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
      expect(users[0]).toMatchObject({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      });
    });

    it('should update user when id already exists', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'old_username',
        fullname: 'Old Fullname',
        password: 'old-password',
      });

      const updatedUser = User.create({
        id: 'user-123',
        username: 'new_username',
        fullname: 'New Fullname',
        password: 'new-password',
      });

      // Action
      const result = await userRepository.save(updatedUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
      expect(users[0]).toMatchObject({
        id: 'user-123',
        username: 'new_username',
        fullname: 'New Fullname',
        password: 'new-password',
      });

      expect(result.id.value).toBe('user-123');
      expect(result.username.value).toBe('new_username');
      expect(result.fullname.value).toBe('New Fullname');
      expect(result.password.value).toBe('new-password');
    });
  });

  describe('findById', () => {
    it('should return null when user is not found', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);

      // Action & Assert
      await expect(userRepository.findById(UserId.create('user-404'))).resolves.toBeNull();
    });

    it('should return user entity when user is found', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      });

      // Action
      const result = await userRepository.findById(UserId.create('user-123'));

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id.value).toBe('user-123');
      expect(result?.username.value).toBe('dicoding');
      expect(result?.fullname.value).toBe('Dicoding Indonesia');
      expect(result?.password.value).toBe('secret');
    });
  });

  describe('findByUsername', () => {
    it('should return null when user is not found', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);

      // Action & Assert
      await expect(
        userRepository.findByUsername(Username.create('not_registered')),
      ).resolves.toBeNull();
    });

    it('should return user entity when user is found', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      });

      // Action
      const result = await userRepository.findByUsername(Username.create('dicoding'));

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id.value).toBe('user-123');
      expect(result?.username.value).toBe('dicoding');
      expect(result?.fullname.value).toBe('Dicoding Indonesia');
      expect(result?.password.value).toBe('secret');
    });
  });

  describe('existsByUsername', () => {
    it('should return false when username is not found', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);

      // Action
      const result = await userRepository.existsByUsername(Username.create('not_registered'));

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when username exists', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      // Action
      const result = await userRepository.existsByUsername(Username.create('dicoding'));

      // Assert
      expect(result).toBe(true);
    });
  });
});
