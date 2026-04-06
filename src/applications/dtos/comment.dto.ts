export interface CreateCommentDto {
  threadId: string;
  parentId?: string | null;
  content: string;
  userId: string;
}
