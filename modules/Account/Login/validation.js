/*
 * IMPORTS
 */
import { z } from 'zod';

/*
 * EXPORTS
 */
export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
