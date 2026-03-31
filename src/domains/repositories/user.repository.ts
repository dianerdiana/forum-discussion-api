import type { User } from '../entities/user.js';

export interface UserRepository {
  addUser(user: User): Promise<void>;
  existsUsername(username: string): Promise<boolean>;
  getPasswordByUsername(username: string): Promise<string>;
  getIdByUsername(username: string): Promise<string>;
}
