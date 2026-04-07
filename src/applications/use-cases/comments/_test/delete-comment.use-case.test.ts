import { vi } from 'vitest';

import { NotFoundError } from '@/commons/index.js';

import {
  Comment,
  CommentId,
  type CommentRepository,
  DomainError,
  ThreadId,
  type ThreadRepository,
  UserId,
  type UserRepository,
} from '@/domains/index.js';

import { DeleteCommentUseCase } from '../delete-comment.use-case.js';

describe('DeleteCommentUseCase', () => {
  const ownerComment = Comment.create({
    id: 'comment-123',
    threadId: 'thread-123',
    content: 'A comment content',
    owner: 'user-123',
  });

  it('should delete a root comment when requester is the owner', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
      parentId: null,
    };

    const deleteMock = vi.fn().mockResolvedValue(undefined);

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
      delete: deleteMock,
      findThreadComments: vi.fn(),
      findById: vi.fn().mockResolvedValue(ownerComment),
    };

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await useCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.findById).toHaveBeenCalledWith(
      CommentId.create(useCasePayload.id),
    );
    expect(mockThreadRepository.findById).toHaveBeenCalledWith(
      ThreadId.create(useCasePayload.threadId),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create(useCasePayload.userId));
    expect(deleteMock).toHaveBeenCalledWith(CommentId.create(useCasePayload.id));
  });

  it('should also verify parent comment exists when deleting a reply', async () => {
    // Arrange
    const replyComment = Comment.create({
      id: 'comment-reply-1',
      threadId: 'thread-123',
      parentId: 'comment-123',
      content: 'A reply',
      owner: 'user-123',
    });

    const useCasePayload = {
      id: 'comment-reply-1',
      threadId: 'thread-123',
      userId: 'user-123',
      parentId: 'comment-123',
    };

    const findByIdMock = vi
      .fn()
      .mockResolvedValueOnce(replyComment) // first call: fetch the comment itself
      .mockResolvedValueOnce(ownerComment); // second call: fetch the parent

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
      delete: vi.fn().mockResolvedValue(undefined),
      findThreadComments: vi.fn(),
      findById: findByIdMock,
    };

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await useCase.execute(useCasePayload);

    // Assert
    expect(findByIdMock).toHaveBeenCalledTimes(2);
    expect(findByIdMock).toHaveBeenCalledWith(CommentId.create('comment-reply-1'));
    expect(findByIdMock).toHaveBeenCalledWith(CommentId.create('comment-123'));
    expect(mockThreadRepository.findById).toHaveBeenCalledWith(
      ThreadId.create(useCasePayload.threadId),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create(useCasePayload.userId));
    expect(mockCommentRepository.delete).toHaveBeenCalledWith(CommentId.create(useCasePayload.id));
  });

  it('should throw NotFoundError when parent comment is not found when deleting a reply', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-reply-1',
      threadId: 'thread-123',
      userId: 'user-123',
      parentId: 'comment-404',
    };

    const findByIdMock = vi
      .fn()
      .mockResolvedValueOnce(
        Comment.create({
          id: 'comment-reply-1',
          threadId: 'thread-123',
          parentId: 'comment-404',
          content: 'A reply',
          owner: 'user-123',
        }),
      ) // first call: fetch the reply itself
      .mockRejectedValueOnce(new NotFoundError('komentar tidak ditemukan')); // second call: parent not found

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
      findById: findByIdMock,
    };

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(findByIdMock).toHaveBeenCalledWith(CommentId.create('comment-reply-1'));
    expect(findByIdMock).toHaveBeenCalledWith(CommentId.create('comment-404'));
    expect(mockCommentRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw DomainError when requester is not the owner', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-other',
      parentId: null,
    };

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
      findById: vi.fn().mockResolvedValue(ownerComment),
    };

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(DomainError);
    expect(mockCommentRepository.findById).toHaveBeenCalledWith(
      CommentId.create(useCasePayload.id),
    );
    expect(mockThreadRepository.findById).toHaveBeenCalledWith(
      ThreadId.create(useCasePayload.threadId),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create(useCasePayload.userId));
    expect(mockCommentRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when comment is not found', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-404',
      threadId: 'thread-123',
      userId: 'user-123',
    };

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
      findById: vi.fn().mockRejectedValue(new NotFoundError('komentar tidak ditemukan')),
    };

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockCommentRepository.findById).toHaveBeenCalledWith(
      CommentId.create(useCasePayload.id),
    );
    expect(mockThreadRepository.findById).toHaveBeenCalledWith(
      ThreadId.create(useCasePayload.threadId),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create(useCasePayload.userId));
  });

  it('should throw NotFoundError when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-404',
      userId: 'user-123',
    };

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockRejectedValue(new NotFoundError('thread tidak ditemukan')),
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
      findById: vi.fn().mockResolvedValue(ownerComment),
    };

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockCommentRepository.findById).toHaveBeenCalledWith(
      CommentId.create(useCasePayload.id),
    );
    expect(mockThreadRepository.findById).toHaveBeenCalledWith(
      ThreadId.create(useCasePayload.threadId),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create(useCasePayload.userId));
  });

  it('should throw NotFoundError when user is not found', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-404',
    };

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue({}),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockRejectedValue(new NotFoundError('user tidak ditemukan')),
      findByIds: vi.fn(),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn(),
      findById: vi.fn().mockResolvedValue(ownerComment),
    };

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockCommentRepository.findById).toHaveBeenCalledWith(
      CommentId.create(useCasePayload.id),
    );
    expect(mockThreadRepository.findById).toHaveBeenCalledWith(
      ThreadId.create(useCasePayload.threadId),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create(useCasePayload.userId));
  });
});
