export class PasswordHash {
  async hash(_password: string): Promise<string> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  async comparePassword(_plain: string, _encrypted: string): Promise<boolean> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}
