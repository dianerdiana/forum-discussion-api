export interface CreateThreadDto {
  title: string;
  body: string;
  owner: string;
}

export interface GetDetailThreadDto {
  id: string;
  userId: string;
}
