export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly password: string,
    public readonly fullname: string,
  ) {
    if (!id) {
      throw new Error('USER.ID_REQUIRED');
    }

    if (!password) {
      throw new Error('USER.PASSWORD_REQUIRED');
    }

    if (username.length > 50) {
      throw new Error('USER.USERNAME_LIMIT_CHAR');
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }

    if (!fullname) {
      throw new Error('USER.FULLNAME_REQUIRED');
    }
  }
}
