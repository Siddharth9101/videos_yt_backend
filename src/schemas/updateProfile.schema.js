import { z } from "zod";

export const updateProfileSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  fullname: z
    .string()
    .min(3, { message: "Fullname must be atleast 3 characters long" }),
});
