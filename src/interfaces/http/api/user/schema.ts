import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string({
      error: (val) => {
        if (val.input === undefined) return 'username is required';

        return 'username must be a string';
      },
    })
    .max(50, { error: 'username is too long (max 50)' }),
  password: z.string({
    error: (val) => {
      if (val.input === undefined) return 'password is required';

      return 'password must be a string';
    },
  }),
  fullname: z.string({
    error: (val) => {
      if (val.input === undefined) return 'fullname is required';

      return 'fullname must be a string';
    },
  }),
});
