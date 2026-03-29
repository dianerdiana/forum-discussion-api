import { ClientError } from '../client-error.js';

describe('ClientError', () => {
  it('should throw error when directly use it', () => {
    expect(() => new ClientError('')).toThrow('cannot instantiate abstract class');
  });
});
