import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
});

export const registerSchema = loginSchema.merge(
  z.object({
    username: z.string()
    .min(3, "Username must contain at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers and underscores")
    .max(10, "Username must contain at most 10 characters")
  })
);
