import { vi } from 'vitest';

import { NotFoundError } from '@/commons/index.js';

import {
  Comment,
  type CommentLikeRepository,
  type CommentRepository,
  Thread,
  ThreadId,
  type ThreadRepository,
  User,
  UserId,
  type UserRepository,
} from '@/domains/index.js';

import { GetDetailThreadUseCase } from '../get-detail-thread.use-case.js';

describe('GetDetailThreadUseCase', () => {
  const currentDate = new Date('2026-04-06T00:00:00.000Z');

  const thread = Thread.reconstitute({
    id: 'thread-123',
    title: 'Thread Title',
    body: 'Thread body',
    owner: 'user-123',
    createdAt: currentDate,
  });

  const viewer = User.reconstitute({
    id: 'user-123',
    username: 'johndoe',
    fullname: 'John Doe',
    password: 'hashed_password',
    createdAt: currentDate,
    updatedAt: currentDate,
  });

  const useCasePayload = 'thread-123';

  it('should return thread detail with empty comments', async () => {
    // Arrange
    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(thread),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue(viewer),
      findByIds: vi.fn().mockResolvedValue([]),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn().mockResolvedValue([]),
      findById: vi.fn(),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      findThreadCommentLikes: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };

    const useCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      date: currentDate.toISOString(),
      username: 'johndoe',
      comments: [],
    });

    expect(mockThreadRepository.findById).toHaveBeenCalledWith(ThreadId.create('thread-123'));
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create('user-123'));
    expect(mockCommentRepository.findThreadComments).toHaveBeenCalledWith(
      ThreadId.create('thread-123'),
    );
    expect(mockUserRepository.findByIds).toHaveBeenCalledWith([]);
  });

  it('should return thread detail with flat comments', async () => {
    // Arrange
    const commentAuthor = User.reconstitute({
      id: 'user-456',
      username: 'janedoe',
      fullname: 'Jane Doe',
      password: 'hashed_password',
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    const comment = Comment.reconstitute({
      id: 'comment-1',
      threadId: 'thread-123',
      parentId: '',
      content: 'A flat comment',
      owner: 'user-456',
      createdAt: currentDate,
      deletedAt: null,
    });

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(thread),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue(viewer),
      findByIds: vi.fn().mockResolvedValue([commentAuthor]),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn().mockResolvedValue([comment]),
      findById: vi.fn(),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      findThreadCommentLikes: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };

    const useCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      date: currentDate.toISOString(),
      username: 'johndoe',
      comments: [
        {
          id: 'comment-1',
          username: 'janedoe',
          date: currentDate.toISOString(),
          content: 'A flat comment',
          replies: [],
          likeCount: 0,
        },
      ],
    });

    expect(mockThreadRepository.findById).toHaveBeenCalledWith(ThreadId.create('thread-123'));
    expect(mockCommentRepository.findThreadComments).toHaveBeenCalledWith(
      ThreadId.create('thread-123'),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create('user-123'));
    expect(mockUserRepository.findByIds).toHaveBeenCalledOnce();
  });

  it('should build nested comment replies tree correctly', async () => {
    // Arrange
    const commentAuthor = User.reconstitute({
      id: 'user-456',
      username: 'janedoe',
      fullname: 'Jane Doe',
      password: 'hashed_password',
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    const parentComment = Comment.reconstitute({
      id: 'comment-1',
      threadId: 'thread-123',
      parentId: '',
      content: 'Parent comment',
      owner: 'user-456',
      createdAt: currentDate,
      deletedAt: null,
    });

    const replyComment = Comment.reconstitute({
      id: 'comment-2',
      threadId: 'thread-123',
      parentId: 'comment-1',
      content: 'A reply',
      owner: 'user-456',
      createdAt: currentDate,
      deletedAt: null,
    });

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(thread),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue(viewer),
      findByIds: vi.fn().mockResolvedValue([commentAuthor]),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn().mockResolvedValue([parentComment, replyComment]),
      findById: vi.fn(),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      findThreadCommentLikes: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };

    const useCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result.comments).toHaveLength(1);
    expect(result.comments[0]).toStrictEqual({
      id: 'comment-1',
      username: 'janedoe',
      date: currentDate.toISOString(),
      content: 'Parent comment',
      likeCount: 0,
      replies: [
        {
          id: 'comment-2',
          username: 'janedoe',
          date: currentDate.toISOString(),
          content: 'A reply',
          replies: [],
          likeCount: 0,
        },
      ],
    });

    expect(mockThreadRepository.findById).toHaveBeenCalledWith(ThreadId.create('thread-123'));
    expect(mockCommentRepository.findThreadComments).toHaveBeenCalledWith(
      ThreadId.create('thread-123'),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create('user-123'));
    expect(mockUserRepository.findByIds).toHaveBeenCalledOnce();
  });

  it('should mask content of soft-deleted comment with placeholder', async () => {
    // Arrange
    const commentAuthor = User.reconstitute({
      id: 'user-456',
      username: 'janedoe',
      fullname: 'Jane Doe',
      password: 'hashed_password',
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    const deletedComment = Comment.reconstitute({
      id: 'comment-1',
      threadId: 'thread-123',
      parentId: '',
      content: 'Original content',
      owner: 'user-456',
      createdAt: currentDate,
      deletedAt: currentDate,
    });

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(thread),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue(viewer),
      findByIds: vi.fn().mockResolvedValue([commentAuthor]),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn().mockResolvedValue([deletedComment]),
      findById: vi.fn(),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      findThreadCommentLikes: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };

    const useCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result.comments[0]!.content).toBe('**komentar telah dihapus**');

    expect(mockThreadRepository.findById).toHaveBeenCalledWith(ThreadId.create('thread-123'));
    expect(mockCommentRepository.findThreadComments).toHaveBeenCalledWith(
      ThreadId.create('thread-123'),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create('user-123'));
    expect(mockUserRepository.findByIds).toHaveBeenCalledOnce();
  });

  it('should mask content of soft-deleted reply with placeholder', async () => {
    // Arrange
    const commentAuthor = User.reconstitute({
      id: 'user-456',
      username: 'janedoe',
      fullname: 'Jane Doe',
      password: 'hashed_password',
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    const parentComment = Comment.reconstitute({
      id: 'comment-1',
      threadId: 'thread-123',
      parentId: '',
      content: 'Parent comment',
      owner: 'user-456',
      createdAt: currentDate,
      deletedAt: null,
    });

    const deletedReply = Comment.reconstitute({
      id: 'comment-2',
      threadId: 'thread-123',
      parentId: 'comment-1',
      content: 'Original reply content',
      owner: 'user-456',
      createdAt: currentDate,
      deletedAt: currentDate,
    });

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(thread),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue(viewer),
      findByIds: vi.fn().mockResolvedValue([commentAuthor]),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn().mockResolvedValue([parentComment, deletedReply]),
      findById: vi.fn(),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      findThreadCommentLikes: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };

    const useCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result.comments[0]!.replies![0]!.content).toBe('**balasan telah dihapus**');

    expect(mockThreadRepository.findById).toHaveBeenCalledWith(ThreadId.create('thread-123'));
    expect(mockCommentRepository.findThreadComments).toHaveBeenCalledWith(
      ThreadId.create('thread-123'),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create('user-123'));
    expect(mockUserRepository.findByIds).toHaveBeenCalledOnce();
  });

  it('should throw NotFoundError when thread is not found', async () => {
    // Arrange
    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockRejectedValue(new NotFoundError('thread not found')),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue(viewer),
      findByIds: vi.fn().mockResolvedValue([]),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn().mockResolvedValue([]),
      findById: vi.fn(),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      findThreadCommentLikes: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };

    const useCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.findById).toHaveBeenCalledWith(ThreadId.create('thread-123'));
    expect(mockCommentRepository.findThreadComments).toHaveBeenCalledWith(
      ThreadId.create('thread-123'),
    );
  });

  it('should throw NotFoundError when viewer user is not found', async () => {
    // Arrange
    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(thread),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockRejectedValue(new NotFoundError('user not found')),
      findByIds: vi.fn().mockResolvedValue([]),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn().mockResolvedValue([]),
      findById: vi.fn(),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      findThreadCommentLikes: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };

    const useCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.findById).toHaveBeenCalledWith(ThreadId.create('thread-123'));
    expect(mockCommentRepository.findThreadComments).toHaveBeenCalledWith(
      ThreadId.create('thread-123'),
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(UserId.create('user-123'));
  });

  it('should use [deleted] as username when comment owner is not found in user map', async () => {
    // Arrange
    const comment = Comment.reconstitute({
      id: 'comment-1',
      threadId: 'thread-123',
      parentId: '',
      content: 'A comment from unknown user',
      owner: 'user-999',
      createdAt: currentDate,
      deletedAt: null,
    });

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(thread),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue(viewer),
      findByIds: vi.fn().mockResolvedValue([]), // owner tidak ditemukan
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn().mockResolvedValue([comment]),
      findById: vi.fn(),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      findThreadCommentLikes: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    };

    const useCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result.comments[0]!.username).toBe('[deleted]');
  });

  it('should include likeCount for each comment based on comment likes', async () => {
    // Arrange
    const commentAuthor = User.reconstitute({
      id: 'user-456',
      username: 'janedoe',
      fullname: 'Jane Doe',
      password: 'hashed_password',
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    const comment = Comment.reconstitute({
      id: 'comment-1',
      threadId: 'thread-123',
      parentId: '',
      content: 'A comment',
      owner: 'user-456',
      createdAt: currentDate,
      deletedAt: null,
    });

    const { CommentLike } = await import('@/domains/index.js');
    const like1 = CommentLike.create({
      id: 'like-1',
      threadId: 'thread-123',
      commentId: 'comment-1',
      userId: 'user-123',
    });
    const like2 = CommentLike.create({
      id: 'like-2',
      threadId: 'thread-123',
      commentId: 'comment-1',
      userId: 'user-456',
    });

    const mockThreadRepository: ThreadRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(thread),
    };

    const mockUserRepository: UserRepository = {
      save: vi.fn(),
      existsByUsername: vi.fn(),
      findByUsername: vi.fn(),
      findById: vi.fn().mockResolvedValue(viewer),
      findByIds: vi.fn().mockResolvedValue([commentAuthor]),
    };

    const mockCommentRepository: CommentRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findThreadComments: vi.fn().mockResolvedValue([comment]),
      findById: vi.fn(),
    };

    const mockCommentLikeRepository: CommentLikeRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      findThreadCommentLikes: vi.fn().mockResolvedValue([like1, like2]),
      delete: vi.fn(),
    };

    const useCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result.comments[0]!.likeCount).toBe(2);
    expect(mockCommentLikeRepository.findThreadCommentLikes).toHaveBeenCalledWith(
      ThreadId.create('thread-123'),
    );
  });
});
