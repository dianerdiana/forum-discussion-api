export interface CommentResponse {
  id: string;
  username: string;
  date: string;
  content: string;
  replies?: CommentResponse[];
}
