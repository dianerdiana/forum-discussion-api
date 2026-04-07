import { InvariantError } from '@/commons/index.js';

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
        password: 'secret_pass',
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
        password: 'secret_pass',
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

    it('should throw InvariantError when database returns no rows', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);
      const newUser = User.create({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret_pass',
      });

      vi.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: [],
      });

      // Action & Assert
      await expect(userRepository.save(newUser)).rejects.toThrow(InvariantError);
    });
  });

  describe('findById', () => {
    it('should throwing error when user is not found', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);

      // Action & Assert
      await expect(userRepository.findById(UserId.create('user-404'))).rejects.toThrow(
        'user tidak ditemukan',
      );
    });

    it('should return user entity when user is found', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret_pass',
      });

      // Action
      const result = await userRepository.findById(UserId.create('user-123'));

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id.value).toBe('user-123');
      expect(result?.username.value).toBe('dicoding');
      expect(result?.fullname.value).toBe('Dicoding Indonesia');
      expect(result?.password.value).toBe('secret_pass');
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
        password: 'secret_pass',
      });

      // Action
      const result = await userRepository.findByUsername(Username.create('dicoding'));

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id.value).toBe('user-123');
      expect(result?.username.value).toBe('dicoding');
      expect(result?.fullname.value).toBe('Dicoding Indonesia');
      expect(result?.password.value).toBe('secret_pass');
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

  describe('findByIds', () => {
    it('should return empty array when no ids are provided', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);

      // Action
      const result = await userRepository.findByIds([]);

      // Assert
      expect(result).toStrictEqual([]);
    });

    it('should return empty array when none of the ids exist', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);

      // Action
      const result = await userRepository.findByIds([
        UserId.create('user-404'),
        UserId.create('user-405'),
      ]);

      // Assert
      expect(result).toStrictEqual([]);
    });

    it('should return only existing users when some ids do not exist', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret_pass',
      });

      // Action
      const result = await userRepository.findByIds([
        UserId.create('user-123'),
        UserId.create('user-404'),
      ]);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]!.id.value).toBe('user-123');
      expect(result[0]!.username.value).toBe('dicoding');
    });

    it('should return all users when all ids exist', async () => {
      // Arrange
      const userRepository = new PostgresUserRepository(db);
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'secret_pass',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'johndoe',
        fullname: 'John Doe',
        password: 'secret_pass',
      });

      // Action
      const result = await userRepository.findByIds([
        UserId.create('user-123'),
        UserId.create('user-456'),
      ]);

      // Assert
      expect(result).toHaveLength(2);

      const ids = result.map((u) => u.id.value);
      expect(ids).toContain('user-123');
      expect(ids).toContain('user-456');
    });
  });
});
