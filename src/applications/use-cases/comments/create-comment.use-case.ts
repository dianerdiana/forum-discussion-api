import type { CreateCommentDto } from '@/applications/dtos/index.js';
import type { CreateCommentResponse } from '@/applications/responses/index.js';

import {
  Comment,
  CommentContent,
  CommentId,
  type CommentRepository,
  ThreadId,
  type ThreadRepository,
  UserId,
  type UserRepository,
} from '@/domains/index.js';

export class CreateCommentUseCase {
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

  async execute(createCommentDto: CreateCommentDto): Promise<CreateCommentResponse> {
    const { content, parentId, threadId, userId } = this.validateDto(createCommentDto);

    await Promise.all([
      this.threadRepository.findById(threadId),
      this.userRepository.findById(userId),
    ]);

    const comment = Comment.create({
      content: content.value,
      threadId: threadId.value,
      parentId: parentId ? parentId.value : null,
      owner: userId.value,
    });

    const savedComment = await this.commentRepository.save(comment);

    return {
      id: savedComment.id.value,
      content: savedComment.content.value,
      owner: savedComment.content.value,
    };
  }

  private validateDto(createCommentDto: CreateCommentDto): {
    threadId: ThreadId;
    userId: UserId;
    content: CommentContent;
    parentId: CommentId | null;
  } {
    const { content, threadId, userId, parentId } = createCommentDto;
    return {
      threadId: ThreadId.create(threadId),
      content: CommentContent.create(content),
      userId: UserId.create(userId),
      parentId: parentId ? CommentId.create(parentId) : null,
    };
  }
}
