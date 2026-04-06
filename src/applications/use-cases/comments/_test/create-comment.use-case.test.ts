import { vi } from 'vitest';

import { NotFoundError } from '@/commons/index.js';

import {
  Comment,
  CommentId,
  type CommentRepository,
  ThreadId,
  type ThreadRepository,
  UserId,
  type UserRepository,
} from '@/domains/index.js';

import { CreateCommentUseCase } from '../create-comment.use-case.js';

describe('CreateCommentUseCase', () => {
  it('should orchestrate creating a root comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      userId: 'user-123',
      content: 'A new comment',
      parentId: null,
    };

    const savedComment = Comment.create({
      id: 'comment-123',
      threadId: useCasePayload.threadId,
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    const saveMock = vi.fn().mockResolvedValue(savedComment);

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue({}),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue({}),
      findByIds: vi.fn(),
    };

    const mockCommentRepository: CommentRepository = {
      save: saveMock,
      delete: vi.fn(),
      findThreadComments: vi.fn(),
    };

    const useCase = new CreateCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual({
      id: savedComment.id.value,
      content: useCasePayload.content,
      owner: savedComment.content.value,
    });

    expect(mockThreadRepository.findById).toHaveBeenCalledWith(
      ThreadId.create(useCasePayload.threadId),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create(useCasePayload.userId));
    expect(saveMock).toHaveBeenCalledOnce();

    const commentArg = saveMock.mock.calls[0]![0];
    expect(commentArg.id).toBeInstanceOf(CommentId);
    expect(commentArg.threadId.value).toBe(useCasePayload.threadId);
    expect(commentArg.content.value).toBe(useCasePayload.content);
    expect(commentArg.owner.value).toBe(useCasePayload.userId);
    expect(commentArg.parentId).toBeNull();
  });

  it('should orchestrate creating a reply comment with parentId correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      userId: 'user-123',
      content: 'A reply comment',
      parentId: 'comment-parent-1',
    };

    const savedComment = Comment.create({
      id: 'comment-reply-1',
      threadId: useCasePayload.threadId,
      parentId: useCasePayload.parentId,
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    const saveMock = vi.fn().mockResolvedValue(savedComment);

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue({}),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue({}),
      findByIds: vi.fn(),
    };

    const mockCommentRepository: CommentRepository = {
      save: saveMock,
      delete: vi.fn(),
      findThreadComments: vi.fn(),
    };

    const useCase = new CreateCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result.id).toBe(savedComment.id.value);

    const commentArg = saveMock.mock.calls[0]![0];
    expect(commentArg.parentId).toBeInstanceOf(CommentId);
    expect(commentArg.parentId?.value).toBe(useCasePayload.parentId);
  });

  it('should throw NotFoundError when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-404',
      userId: 'user-123',
      content: 'A comment',
    };

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockRejectedValue(new NotFoundError('thread not found')),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue({}),
      findByIds: vi.fn(),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn(),
    };

    const useCase = new CreateCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when user is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      userId: 'user-404',
      content: 'A comment',
    };

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue({}),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockRejectedValue(new NotFoundError('user not found')),
      findByIds: vi.fn(),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn(),
    };

    const useCase = new CreateCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
  });
});
