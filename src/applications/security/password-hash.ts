export interface PasswordHash {
  hash: (password: string) => Promise<string>;
  compare: (plain: string, encrypted: string) => Promise<boolean>;
}
