import { z } from "zod";

export const loginWithUsernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});

export const loginWithEmailSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
});
