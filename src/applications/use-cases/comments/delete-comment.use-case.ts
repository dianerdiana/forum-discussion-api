import type { DeleteCommentDto } from '@/applications/dtos/index.js';

import {
  CommentId,
  type CommentRepository,
  DomainError,
  ThreadId,
  type ThreadRepository,
  UserId,
  type UserRepository,
} from '@/domains/index.js';

export class DeleteCommentUseCase {
  private readonly threadRepository: ThreadRepository;
  private readonly userRepository: UserRepository;
  private readonly commentRepository: CommentRepository;

  constructor({
    threadRepository,
    userRepository,
    commentRepository,
  }: {
    threadRepository: ThreadRepository;
    userRepository: UserRepository;
    commentRepository: CommentRepository;
  }) {
    this.userRepository = userRepository;
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(deleteCommentDto: DeleteCommentDto): Promise<void> {
    const { id, threadId, parentId, userId } = this.validateDto(deleteCommentDto);

    const [flatComment] = await Promise.all([
      this.commentRepository.findById(id),
      this.threadRepository.findById(threadId),
      this.userRepository.findById(userId),
    ]);

    if (parentId) await this.commentRepository.findById(parentId);

    if (!flatComment.owner.equals(userId)) {
      throw new DomainError('DELETE_COMMENT.FORBIDDEN');
    }

    await this.commentRepository.delete(id);
  }

  private validateDto(createCommentDto: DeleteCommentDto): {
    id: CommentId;
    threadId: ThreadId;
    userId: UserId;
    parentId: CommentId | null;
  } {
    const { id, threadId, userId, parentId } = createCommentDto;
    return {
      id: CommentId.create(id),
      threadId: ThreadId.create(threadId),
      parentId: parentId ? CommentId.create(parentId) : null,
      userId: UserId.create(userId),
    };
  }
}
