import { z } from "zod";
import { imageFileValidator } from "../utils/fileValidator";

export const updateCoverImageSchema = z.object({
  coverImage: z.custom(imageFileValidator, {
    message: "cover image must be an image",
  }),
});
