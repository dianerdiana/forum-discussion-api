import { vi } from 'vitest';

import { NotFoundError } from '@/commons/index.js';

import {
  Thread,
  ThreadId,
  type ThreadRepository,
  UserId,
  type UserRepository,
} from '@/domains/index.js';

import { CreateThreadUseCase } from '../create-thread.use-case.js';

describe('CreateThreadUseCase', () => {
  it('should orchestrating the create thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'A Thread Title',
      body: 'A thread body content',
      owner: 'user-123',
    };

    const savedThread = Thread.create({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });

    const saveMock = vi.fn().mockResolvedValue(savedThread);

    const mockThreadRepository: ThreadRepository = {
      save: saveMock,
      findById: vi.fn(),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue({}),
      findByIds: vi.fn(),
    };

    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const result = await createThreadUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual({
      id: savedThread.id.value,
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create(useCasePayload.owner));
    expect(saveMock).toHaveBeenCalledOnce();

    const savedThreadArg = saveMock.mock.calls[0]![0];

    expect(savedThreadArg.id).toBeInstanceOf(ThreadId);
    expect(savedThreadArg.title.value).toBe(useCasePayload.title);
    expect(savedThreadArg.body.value).toBe(useCasePayload.body);
    expect(savedThreadArg.owner.value).toBe(useCasePayload.owner);
  });

  it('should throw NotFoundError when owner user is not found', async () => {
    // Arrange
    const useCasePayload = {
      title: 'A Thread Title',
      body: 'A thread body content',
      owner: 'user-404',
    };

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn(),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockRejectedValue(new NotFoundError('user not found')),
      findByIds: vi.fn(),
    };

    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action & Assert
    await expect(createThreadUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
  });
});
