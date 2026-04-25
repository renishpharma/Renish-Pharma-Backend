import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    userId: z.string().min(3, "User ID must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters")
  })
});