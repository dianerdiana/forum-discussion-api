import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const authenticationSchema = z.object({
  refreshToken: z.string(),
});
