import { z } from 'zod';

// User Schema
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url().optional(),
  role: z.enum(['user', 'admin']).default('user'),
  isActive: z.boolean().default(true),
});

export type UserInput = z.infer<typeof userSchema>;

// Update User Schema
export const updateUserSchema = userSchema.partial();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
