import { z } from 'zod';
// signup
export const signupInput = z.object({
  name: z
    .string()
    .min(4, { message: 'Must be 4 or more characters long' })
    .max(20, { message: 'Must be 20 or fewer characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(4, { message: 'Must be 4 or more characters long' })
    .max(20, { message: 'Must be 20 or fewer characters long' }),
});

export type signupType = z.infer<typeof signupInput>;

// signin
export const signinInput = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
});

export type SigninType = z.infer<typeof signinInput>;
