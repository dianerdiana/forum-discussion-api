import { DomainError } from '@/domains/commons/index.js';
import { ThreadBody, ThreadId, ThreadTitle, UserId } from '@/domains/value-objects/index.js';

import { Thread } from '../thread.js';

describe('Thread', () => {
  describe('create', () => {
    it('should create a Thread entity with required fields', () => {
      // Arrange
      const props = {
        title: 'A Thread Title',
        body: 'A thread body content',
        owner: 'user-123',
      };

      // Action
      const thread = Thread.create(props);

      // Assert
      expect(thread).toBeInstanceOf(Thread);
      expect(thread.id).toBeInstanceOf(ThreadId);
      expect(thread.title).toBeInstanceOf(ThreadTitle);
      expect(thread.title.value).toBe(props.title);
      expect(thread.body).toBeInstanceOf(ThreadBody);
      expect(thread.body.value).toBe(props.body);
      expect(thread.owner).toBeInstanceOf(UserId);
      expect(thread.owner.value).toBe(props.owner);
      expect(thread.createdAt).toBeInstanceOf(Date);
    });

    it('should use provided id when given', () => {
      // Arrange
      const props = {
        id: 'thread-123',
        title: 'A Thread Title',
        body: 'A thread body content',
        owner: 'user-123',
      };

      // Action
      const thread = Thread.create(props);

      // Assert
      expect(thread.id.value).toBe('thread-123');
    });

    it('should throw DomainError when title is empty', () => {
      // Arrange
      const props = {
        title: '',
        body: 'A thread body content',
        owner: 'user-123',
      };

      // Action & Assert
      expect(() => Thread.create(props)).toThrow(DomainError);
    });

    it('should throw DomainError when body is empty', () => {
      // Arrange
      const props = {
        title: 'A Thread Title',
        body: '',
        owner: 'user-123',
      };

      // Action & Assert
      expect(() => Thread.create(props)).toThrow(DomainError);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a Thread entity from persistence data', () => {
      // Arrange
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const props = {
        id: 'thread-123',
        title: 'A Thread Title',
        body: 'A thread body content',
        owner: 'user-123',
        createdAt,
      };

      // Action
      const thread = Thread.reconstitute(props);

      // Assert
      expect(thread).toBeInstanceOf(Thread);
      expect(thread.id.value).toBe(props.id);
      expect(thread.title.value).toBe(props.title);
      expect(thread.body.value).toBe(props.body);
      expect(thread.owner.value).toBe(props.owner);
      expect(thread.createdAt).toBe(createdAt);
    });
  });

  describe('toPersistence', () => {
    it('should return a plain object with all fields', () => {
      // Arrange
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const thread = Thread.reconstitute({
        id: 'thread-123',
        title: 'A Thread Title',
        body: 'A thread body content',
        owner: 'user-123',
        createdAt,
      });

      // Action
      const result = thread.toPersistence();

      // Assert
      expect(result).toStrictEqual({
        id: 'thread-123',
        title: 'A Thread Title',
        body: 'A thread body content',
        owner: 'user-123',
        createdAt,
      });
    });
  });
});
