import { z } from "zod";
import {
  imageFileValidator,
  videoFileValidator,
} from "../utils/fileValidator.js";

export const publishVideoSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be atleast 3 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be atleast 3 characters long" }),
  videoFile: z.custom(videoFileValidator, {
    message: "Only video file is required for uploading",
  }),
  thumbnail: z.custom(imageFileValidator, {
    message: "Only image file is required for thumbnail",
  }),
});
