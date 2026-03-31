import { v7 as uuidV7 } from 'uuid';

import type { IdGenerator } from '@/domains/common/id-generator.js';

export class UuidGenerator implements IdGenerator {
  generate(): string {
    return uuidV7();
  }
}
