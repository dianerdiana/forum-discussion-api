import { vi } from 'vitest';

import { NotFoundError } from '@/commons/index.js';

import type { CommentLikeRepository } from '@/domains/index.js';
import {
  CommentId,
  CommentLike,
  type CommentRepository,
  ThreadId,
  type ThreadRepository,
  UserId,
  type UserRepository,
} from '@/domains/index.js';

import { PerformCommentLikeUseCase } from '../perform-comment-like.use-case.js';

describe('PerformCommentLikeUseCase', () => {
  const buildMocks = ({ existingCommentLike = null as CommentLike | null } = {}) => {
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
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn(),
      findById: vi.fn().mockResolvedValue({}),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      findOne: vi.fn().mockResolvedValue(existingCommentLike),
      findThreadCommentLikes: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    return {
      mockThreadRepository,
      mockUserRepository,
      mockCommentRepository,
      mockCommentLikeRepository,
    };
  };

  it('should save a new CommentLike when no existing like is found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-456',
      userId: 'user-123',
    };

    const {
      mockThreadRepository,
      mockUserRepository,
      mockCommentRepository,
      mockCommentLikeRepository,
    } = buildMocks({ existingCommentLike: null });

    const useCase = new PerformCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await useCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.findById).toHaveBeenCalledWith(
      ThreadId.create(useCasePayload.threadId),
    );
    expect(mockCommentRepository.findById).toHaveBeenCalledWith(
      CommentId.create(useCasePayload.commentId),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create(useCasePayload.userId));
    expect(mockCommentLikeRepository.findOne).toHaveBeenCalledWith({
      threadId: ThreadId.create(useCasePayload.threadId),
      commentId: CommentId.create(useCasePayload.commentId),
      userId: UserId.create(useCasePayload.userId),
    });
    expect(mockCommentLikeRepository.save).toHaveBeenCalledOnce();

    const savedArg: CommentLike = vi.mocked(mockCommentLikeRepository.save).mock.calls[0]![0];
    expect(savedArg).toBeInstanceOf(CommentLike);
    expect(savedArg.threadId.value).toBe(useCasePayload.threadId);
    expect(savedArg.commentId.value).toBe(useCasePayload.commentId);
    expect(savedArg.userId.value).toBe(useCasePayload.userId);
    expect(mockCommentLikeRepository.delete).not.toHaveBeenCalled(); // should not.toHaveBeenCalled
  });

  it('should delete the existing CommentLike when one already exists (unlike)', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-456',
      userId: 'user-123',
    };

    const existingLike = CommentLike.create({
      id: 'like-999',
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });

    const {
      mockThreadRepository,
      mockUserRepository,
      mockCommentRepository,
      mockCommentLikeRepository,
    } = buildMocks({ existingCommentLike: existingLike });

    const useCase = new PerformCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await useCase.execute(useCasePayload);

    // Assert
    expect(mockCommentLikeRepository.delete).toHaveBeenCalledWith({
      threadId: ThreadId.create(useCasePayload.threadId),
      commentId: CommentId.create(useCasePayload.commentId),
      userId: UserId.create(useCasePayload.userId),
    });
    expect(mockCommentLikeRepository.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-404',
      commentId: 'comment-456',
      userId: 'user-123',
    };

    const {
      mockThreadRepository,
      mockUserRepository,
      mockCommentRepository,
      mockCommentLikeRepository,
    } = buildMocks();

    mockThreadRepository.findById = vi
      .fn()
      .mockRejectedValue(new NotFoundError('thread tidak ditemukan'));

    const useCase = new PerformCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockCommentLikeRepository.save).not.toHaveBeenCalled();
    expect(mockCommentLikeRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when comment is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-404',
      userId: 'user-123',
    };

    const {
      mockThreadRepository,
      mockUserRepository,
      mockCommentRepository,
      mockCommentLikeRepository,
    } = buildMocks();

    mockCommentRepository.findById = vi
      .fn()
      .mockRejectedValue(new NotFoundError('komentar tidak ditemukan'));

    const useCase = new PerformCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockCommentLikeRepository.save).not.toHaveBeenCalled();
    expect(mockCommentLikeRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when user is not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-456',
      userId: 'user-404',
    };

    const {
      mockThreadRepository,
      mockUserRepository,
      mockCommentRepository,
      mockCommentLikeRepository,
    } = buildMocks();

    mockUserRepository.findById = vi
      .fn()
      .mockRejectedValue(new NotFoundError('user tidak ditemukan'));

    const useCase = new PerformCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockCommentLikeRepository.save).not.toHaveBeenCalled();
    expect(mockCommentLikeRepository.delete).not.toHaveBeenCalled();
  });
});
