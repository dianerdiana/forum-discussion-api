export type RegisteredUserPayload = {
  id: string;
  username: string;
  fullname: string;
};

export class RegisteredUser {
  id: string;
  username: string;
  fullname: string;

  constructor(payload: RegisteredUserPayload) {
    this._verifyPayload(payload);

    const { id, username, fullname } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  _verifyPayload({ id, username, fullname }: RegisteredUserPayload) {
    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
