import { z } from "zod";

export const createEnquirySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is too short"),

    phone: z
      .string()
      .min(10, "Phone must be at least 10 digits")
      .max(15),

    email: z.string().email().optional(),

    role: z.enum([
      "doctor",
      "hospital",
      "pharmaceutical wholesaler",
      "pharmaceutical distributor"
    ])
  })
});