export interface CommentResponse {
  id: string;
  username: string;
  date: string;
  content: string;
  replies?: CommentResponse[];
}

export interface CreateCommentResponse {
  id: string;
  content: string;
  owner: string;
}
