import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { publishVideoSchema } from "../schemas/publishVideo.schema.js";
import { updateVideoSchema } from "../schemas/updateVideo.schema.js";
import { zodHandler } from "../utils/zodHandler.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const paginateOptions = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const matchOptions = {
    isPublished: true,
  };

  if (query) {
    matchOptions.title = { $regex: query, $options: "i" };
  }

  if (userId) {
    matchOptions.owner = new mongoose.Types.ObjectId(userId);
  }

  const sortOptions = {
    [sortBy]: sortType === "asc" ? 1 : -1,
  };

  const aggVideos = Video.aggregate([
    {
      $match: matchOptions,
    },
    {
      $sort: sortOptions,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        owner: 1,
      },
    },
  ]);

  const videos = await Video.aggregatePaginate(aggVideos, paginateOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid userid");

  const { title, description } = req.body;
  zodHandler(publishVideoSchema, {
    ...req.body,
    videoFile: req?.files?.videoFile?.[0],
    thumbnail: req?.files?.thumbnail?.[0],
  });
  const videoLocalPath = req?.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req?.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath)
    throw new ApiError(400, "video/thumbnail is missing");

  const [video, thumbnail] = await Promise.all([
    uploadOnCloudinary(videoLocalPath),
    uploadOnCloudinary(thumbnailLocalPath),
  ]);

  if (!video?.secure_url || !thumbnail?.secure_url)
    throw new ApiError(500, "failed to upload video or thumbnail");

  await Video.create({
    videoFile: video?.secure_url,
    videoFilePublicId: video?.public_id,
    thumbnail: thumbnail?.secure_url,
    thumbnailPublicId: thumbnail?.public_id,
    title,
    description,
    duration: video?.duration,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  if (!isValidObjectId(videoId) || !isValidObjectId(userId))
    throw new ApiError(400, "Invalid videoId/userId");

  const video = await Video.findById(videoId);

  video.views = video.views + 1;
  await video.save({ validateBeforeSave: false });

  await User.findByIdAndUpdate(userId, {
    $push: {
      watchHistory: videoId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  if (!isValidObjectId(videoId) || !isValidObjectId(userId))
    throw new ApiError(400, "Invalid videoId/ userId");

  zodHandler(updateVideoSchema, { ...req.body, thumbnail: req?.file });

  const { title, description } = req.body;

  const video = await video.findOne({ _id: videoId, owner: userId });

  if (!video) {
    throw new ApiError(401, "Unauthorized");
  }

  const thumbnailLocalPath = req?.file && req.file?.path;

  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail?.secure_url)
      throw new ApiError(500, "failed to upload thumbnail");

    const oldThumbnailPublicId = video.thumbnailPublicId;

    video.thumbnail = thumbnail?.secure_url;
    video.thumbnailPublicId = thumbnail?.public_id;
    await video.save({ validateBeforeSave: false });

    await deleteFromCloudinary(oldThumbnailPublicId, "image");
  }

  video.title = title;
  video.description = description;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  if (!isValidObjectId(videoId) || !isValidObjectId(userId))
    throw new ApiError(400, "Invalid videoId/ userId");

  const video = await video.findOne({ _id: videoId, owner: userId });

  if (!video) {
    throw new ApiError(401, "Unauthorized");
  }

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const userId = req.user?._id;
  if (!isValidObjectId(videoId) || !isValidObjectId(userId))
    throw new ApiError(400, "Invalid videoId/ userId");

  const video = await video.findOne({ _id: videoId, owner: userId });

  if (!video) {
    throw new ApiError(401, "Unauthorized");
  }

  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Publish status updated"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
