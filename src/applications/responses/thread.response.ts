import type { CommentResponse } from './comment.response.js';

export interface GetDetailThreadResponse {
  id: string;
  title: string;
  body: string;
  date: string;
  username: string;
  comments: CommentResponse[];
}
