import type { GetDetailThreadDto } from '@/applications/dtos/index.js';
import type { GetDetailThreadResponse } from '@/applications/responses/index.js';

import {
  type CommentRepository,
  ThreadId,
  type ThreadRepository,
  UserId,
  type UserRepository,
} from '@/domains/index.js';

export class GetDetailThreadUseCase {
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
    this.threadRepository = threadRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
  }

  async execute(getDetailThreadDto: GetDetailThreadDto): Promise<GetDetailThreadResponse> {
    const { id, userId } = this.validateDto(getDetailThreadDto);

    const [thread, user, flatComments] = await Promise.all([
      this.threadRepository.findById(id),
      this.userRepository.findById(userId),
      this.commentRepository.findThreadComments(id),
    ]);

    // 1. Resolve semua username sekaligus (hindari N+1)
    const ownerIds = [...new Set(flatComments.map((c) => c.owner))];
    const commentUsers = await this.userRepository.findByIds(ownerIds);
    const usernameMap = new Map(commentUsers.map((u) => [u.id.value, u.username.value]));

    // 2. Buat Map dari id → node response (masih flat)
    type CommentNode = GetDetailThreadResponse['comments'][number];
    const nodeMap = new Map<string, CommentNode>();

    for (const comment of flatComments) {
      nodeMap.set(comment.id.value, {
        id: comment.id.value,
        username: usernameMap.get(comment.owner.value) ?? '[deleted]',
        date: comment.createdAt.toISOString(),
        content: comment.deletedAt ? '**komentar telah dihapus**' : comment.content.value,
        replies: [],
      });
    }

    // 3. Susun tree: anak masuk ke replies parent-nya
    const rootComments: CommentNode[] = [];

    for (const comment of flatComments) {
      const node = nodeMap.get(comment.id.value)!;
      if (comment.parentId === null) {
        rootComments.push(node);
      } else {
        nodeMap.get(comment.parentId.value)?.replies?.push(node);
      }
    }

    return {
      id: thread.id.value,
      title: thread.title.value,
      body: thread.body.value,
      date: thread.createdAt.toISOString(),
      username: user.username.value,
      comments: rootComments,
    };
  }

  private validateDto(getDetailThreadDto: GetDetailThreadDto): { id: ThreadId; userId: UserId } {
    return {
      id: ThreadId.create(getDetailThreadDto.id),
      userId: UserId.create(getDetailThreadDto.userId),
    };
  }
}
