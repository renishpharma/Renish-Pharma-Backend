import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    userId: z.string().min(3, "User ID must be at least 3 characters"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "manager"])
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional().or(z.literal("")),
    password: z.string().min(6).optional(),
    role: z.enum(["admin", "manager"]).optional()
  })
});
