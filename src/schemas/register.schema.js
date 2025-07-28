import { z } from "zod";
import { imageFileValidator } from "../utils/fileValidator.js";
export const registerSchema = z.object({
  fullname: z
    .string()
    .min(3, { message: "Fullname must be atleast 3 characters long" }),
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters long" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" }),
  avatar: z.custom(imageFileValidator, { message: "avatar must be an image" }),
  coverImage: z
    .custom(imageFileValidator, { message: "cover image must be an image" })
    .optional(),
});
