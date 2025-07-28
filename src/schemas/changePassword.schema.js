import { z } from "zod";

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});
