import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    sku: z.string().min(2),
    description: z.string().min(10),
    category: z.string().min(2),

    shortDescription: z.string().optional(),
    packaging: z.string().optional(),
    packagingType: z.string().optional(),
    composition: z.string().optional(),
    featured: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional(),
    additionalInfo: z.string().optional(),
    specialCare: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional()
  })
});