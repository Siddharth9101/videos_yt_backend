import { z } from "zod";
import { imageFileValidator } from "../utils/fileValidator";

export const updateAvatarSchema = z.object({
  avatar: z.custom(imageFileValidator, { message: "avatar must be an image" }),
});
