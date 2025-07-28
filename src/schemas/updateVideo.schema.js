import { z } from "zod";
import { imageFileValidator } from "../utils/fileValidator.js";

export const updateVideoSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be atleast 3 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be atleast 3 characters long" }),
  thumbnail: z.custom(imageFileValidator, {
    message: "Only image file is required for thumbnail",
  }),
});
