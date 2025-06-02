import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must contain at max 20 letters")
    .regex(
      /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]+$/,
      "Password can include letters, numbers and special characters only."
    )
});

const registerSchema = loginSchema.merge(
  z.object({
    username: z.string()
      .min(3, "Username must contain at least 3 characters")
      .max(18, "Username must contain at max 18 letters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers and underscores")
      .max(10, "Username must contain at most 10 characters")
  })
);

export const authSchema = { registerSchema, loginSchema };