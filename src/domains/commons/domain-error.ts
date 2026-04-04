import type { DomainErrorCode } from '@/commons/index.js';

export class DomainError extends Error {
  constructor(message: DomainErrorCode) {
    super(message);
  }
}
