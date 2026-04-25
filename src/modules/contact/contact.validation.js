import { z } from "zod";

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(2),

    phone: z.string().min(10).max(15),

    email: z.string().email().optional(),

    role: z.enum([
      "doctor",
      "hospital",
      "pharmaceutical wholesaler",
      "pharmaceutical distributor"
    ]),

    message: z.string().min(5).max(500)
  })
});