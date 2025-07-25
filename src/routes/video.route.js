import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getVideoById,
  deleteVideo,
  getVideos,
  uploadVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// secured routes
router.route("/:videoId").get(verifyJWT, getVideoById);
router.route("/upload").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnailFile",
      maxCount: 1,
    },
  ]),
  uploadVideo
);
router.route("/:videoId").delete(verifyJWT, deleteVideo);
router.route("/").get(getVideos); // send page as query

export default router;
