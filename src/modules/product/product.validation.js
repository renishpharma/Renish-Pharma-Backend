import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    sku: z.string().min(2),
    description: z.string().min(10),
    category: z.string().min(2),

    shortDescription: z.string().optional(),
    packaging: z.string().optional(),
    dimensions: z.string().optional(),
    sizes: z.string().optional(),
    additionalInfo: z.string().optional(),
    specialCare: z.string().optional()
  })
});