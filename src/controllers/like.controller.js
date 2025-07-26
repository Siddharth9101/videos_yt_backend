import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  /**
   * get userId and videoId
   * validations
   * check if the like already exists
   * if it dosen't, create new like entry in db
   * if it does, check the owner is same as userId
   * delete it from db(if same)
   * return response
   */
  const userId = req.user?._id;
  const { videoId } = req.params;

  if (!userId || !videoId) throw new ApiError(400, "userId/videoId is missing");

  const like = await Like.find({ likedBy: userId, video: videoId });

  if (!like.length) {
    await Like.create({
      video: videoId,
      likedBy: userId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Video liked successfully"));
  } else {
    await Like.findOneAndDelete({ likedBy: userId, video: videoId });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unliked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { commentId } = req.params;

  if (!userId || !commentId)
    throw new ApiError(400, "userId/commentId is missing");

  const like = await Like.find({ likedBy: userId, comment: commentId });

  if (!like.length) {
    await Like.create({
      comment: commentId,
      likedBy: userId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Comment liked successfully"));
  } else {
    await Like.findOneAndDelete({ likedBy: userId, comment: commentId });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment unliked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { tweetId } = req.params;

  if (!userId || !tweetId) throw new ApiError(400, "userId/tweetId is missing");

  const like = await Like.find({ likedBy: userId, tweet: tweetId });

  if (!like.length) {
    await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Tweet liked successfully"));
  } else {
    await Like.findOneAndDelete({ likedBy: userId, tweet: tweetId });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  /**
   * get userId
   * validate
   * fetch all the likes where likedBy is userId and populate videos
   * return
   */

  const userId = req.user?._id;
  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid userId");

  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
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
        ],
      },
    },
    {
      $addFields: {
        video: {
          $first: "$video",
        },
      },
    },
    {
      $project: {
        video: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked Videos fetched successfully"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
