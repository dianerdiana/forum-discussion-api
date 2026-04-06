import type { User } from '../entities/index.js';
import type { UserId, Username } from '../value-objects/index.js';

export interface UserRepository {
  save(payload: User): Promise<User>;
  findById(id: UserId): Promise<User>;
  findByUsername(username: Username): Promise<User | null>;
  existsByUsername(username: Username): Promise<boolean>;
  findByIds(ids: UserId[]): Promise<User[]>;
}
