export interface CreateCommentDto {
  threadId: string;
  parentId?: string | null;
  content: string;
  userId: string;
}

export interface DeleteCommentDto {
  id: string;
  threadId: string;
  parentId?: string | null;
  userId: string;
}
