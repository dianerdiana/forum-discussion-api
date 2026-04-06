import type { Thread } from '../entities/index.js';
import type { ThreadId } from '../value-objects/index.js';

export interface ThreadRepository {
  save(payload: Thread): Promise<Thread>;
  findById(threadId: ThreadId): Promise<Thread>;
}
