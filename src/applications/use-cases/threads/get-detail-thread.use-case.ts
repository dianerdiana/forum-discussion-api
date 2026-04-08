import type { GetDetailThreadResponse } from '@/applications/responses/index.js';

import {
  type CommentLikeRepository,
  type CommentRepository,
  ThreadId,
  type ThreadRepository,
  type UserRepository,
} from '@/domains/index.js';

export class GetDetailThreadUseCase {
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
    this.threadRepository = threadRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
    this.commentLikeRepository = commentLikeRepository;
  }

  async execute(id: string): Promise<GetDetailThreadResponse> {
    const { threadId } = this.validateDto(id);

    const [thread, flatComments, commentLikes] = await Promise.all([
      this.threadRepository.findById(threadId),
      this.commentRepository.findThreadComments(threadId),
      this.commentLikeRepository.findThreadCommentLikes(threadId),
    ]);

    const ownerThread = await this.userRepository.findById(thread.owner);

    // 1. Resolve semua username sekaligus (hindari N+1)
    const ownerCommentIds = [...new Set(flatComments.map((c) => c.owner))];
    const commentUsers = await this.userRepository.findByIds(ownerCommentIds);
    const usernameMap = new Map(commentUsers.map((u) => [u.id.value, u.username.value]));

    // 2. Buat Map dari commentId → likeCount
    const likeCountMap = new Map<string, number>();
    for (const like of commentLikes) {
      const commentId = like.commentId.value;
      likeCountMap.set(commentId, (likeCountMap.get(commentId) ?? 0) + 1);
    }

    // 3. Buat Map dari id → node response (masih flat)
    type CommentNode = GetDetailThreadResponse['comments'][number];
    const nodeMap = new Map<string, CommentNode>();

    for (const comment of flatComments) {
      nodeMap.set(comment.id.value, {
        id: comment.id.value,
        username: usernameMap.get(comment.owner.value) ?? '[deleted]',
        date: comment.createdAt.toISOString(),
        content: comment.deletedAt
          ? `**${comment.parentId ? 'balasan' : 'komentar'} telah dihapus**`
          : comment.content.value,
        replies: [],
        likeCount: likeCountMap.get(comment.id.value) ?? 0,
      });
    }

    // 4. Susun tree: anak masuk ke replies parent-nya
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
      username: ownerThread.username.value,
      comments: rootComments,
    };
  }

  private validateDto(id: string): { threadId: ThreadId } {
    return {
      threadId: ThreadId.create(id),
    };
  }
}
