import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  /**
   * get userId
   * validate
   * get total videos, likes, comments
   * return
   *  */

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "userId is missing");
  }

  const [videos, likes] = await Promise.all([
    Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          duration: 1,
          views: 1,
          isPublished: 1,
          createdAt: 1,
        },
      },
    ]),
    Like.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "video",
          pipeline: [
            {
              $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
              },
            },
            {
              $addFields: {
                video: {
                  $first: "$video",
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          video: 1,
        },
      },
    ]),
  ]);

  return res.status(200).json(new ApiResponse(200, { videos, likes }, "Ok"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  /**
   * get userId
   * validate
   * get all the videos where owner id userId
   * return
   */

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "userid is missing");
  }

  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
