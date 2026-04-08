import type { PerformCommentLikeDto } from '@/applications/dtos/index.js';

import {
  CommentId,
  CommentLike,
  type CommentRepository,
  ThreadId,
  type ThreadRepository,
  UserId,
  type UserRepository,
} from '@/domains/index.js';
import type { CommentLikeRepository } from '@/domains/repositories/comment-like.repository.js';

export class PerformCommentLikeUseCase {
  private readonly threadRepository: ThreadRepository;
  private readonly userRepository: UserRepository;
  private readonly commentRepository: CommentRepository;
  private readonly commentLikeRepository: CommentLikeRepository;

  constructor({
    threadRepository,
    userRepository,
    commentRepository,
    commentLikeRepository,
  }: {
    threadRepository: ThreadRepository;
    userRepository: UserRepository;
    commentRepository: CommentRepository;
    commentLikeRepository: CommentLikeRepository;
  }) {
    this.userRepository = userRepository;
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.commentLikeRepository = commentLikeRepository;
  }

  async execute(performCommentLikeDto: PerformCommentLikeDto): Promise<void> {
    const { threadId, commentId, userId } = this.validateDto(performCommentLikeDto);

    await this.threadRepository.findById(threadId);
    await this.commentRepository.findById(commentId);
    await this.userRepository.findById(userId);

    const existingCommentLike = await this.commentLikeRepository.findOne({
      threadId,
      commentId,
      userId,
    });

    if (existingCommentLike) {
      await this.commentLikeRepository.delete({ threadId, commentId, userId });
    } else {
      const newCommentLike = CommentLike.create({
        threadId: threadId.value,
        commentId: commentId.value,
        userId: userId.value,
      });
      await this.commentLikeRepository.save(newCommentLike);
    }
  }

  private validateDto(performCommentLikeDto: PerformCommentLikeDto): {
    threadId: ThreadId;
    commentId: CommentId;
    userId: UserId;
  } {
    const { commentId, threadId, userId } = performCommentLikeDto;

    return {
      threadId: ThreadId.create(threadId),
      commentId: CommentId.create(commentId),
      userId: UserId.create(userId),
    };
  }
}
