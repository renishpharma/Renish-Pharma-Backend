import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title is too short").max(150, "Title is too long"),
    content: z.string().min(10, "Content must be at least 10 characters long"),
    author: z.string().optional(),
    status: z.enum(["draft", "published"]).optional(),
    tags: z
      .any()
      .optional()
      .transform((val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val !== "string") return [];
        try {
          return JSON.parse(val);
        } catch (e) {
          return val.split(",").map((t) => t.trim()).filter(Boolean);
        }
      }),
  }),
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150).optional(),
    content: z.string().min(10).optional(),
    author: z.string().optional(),
    status: z.enum(["draft", "published"]).optional(),
    tags: z
      .any()
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val !== "string") return [];
        try {
          return JSON.parse(val);
        } catch (e) {
          return val.split(",").map((t) => t.trim()).filter(Boolean);
        }
      }),
  }),
});
