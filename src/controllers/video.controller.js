import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validatePostVideoBody } from "../utils/validations.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getVideoById = asyncHandler(async (req, res) => {
  // get the user's id
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "User id is missing");
  }
  // get the video's id
  const { videoId } = req.params;
  // validations
  if (!videoId) throw new ApiError(404, "Video id is missing");
  // fetch video from db
  const videoAggr = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
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
              _id: 1,
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
  ]);
  if (!videoAggr || videoAggr.length === 0)
    throw new ApiError(404, "Video does not exist");

  const video = videoAggr[0];
  // add this video is in users watch history
  await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { watchHistory: videoId },
    },
    { new: true }
  );

  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const uploadVideo = asyncHandler(async (req, res) => {
  // get users id
  // get video, thumbnail, title, desc
  // validations
  // upload thumbnail and video on cloudinary
  // check if everything is uploaded
  // create entry in db
  // return

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "UserId is missing");
  }
  const { title, description } = req.body;

  // const videoLocalPath = req.files?.videoFile[0]?.path;
  const videoLocalPath =
    (req?.files &&
      req.files?.videoFile &&
      req.files.videoFile[0] &&
      req.files.videoFile[0]?.path) ||
    "";
  // const thumbnailLocalPath = req.files?.thumbnailFile[0]?.path;
  const thumbnailLocalPath =
    (req?.files &&
      req.files?.thumbnailFile &&
      req.files.thumbnailFile[0] &&
      req.files.thumbnailFile[0]?.path) ||
    "";

  validatePostVideoBody(title, description, videoLocalPath, thumbnailLocalPath);

  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!video?.secure_url || !thumbnail?.secure_url) {
    throw new ApiError(500, "Error while uploading video");
  }

  const videoDoc = await Video.create({
    videoFile: video.secure_url,
    videoFilePublicId: video.public_id,
    thumbnail: thumbnail.secure_url,
    thumbnailPublicId: thumbnail.public_id,
    title,
    description,
    duration: video.duration,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, videoDoc, "Video uploaded successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  // get userId
  // get videoId
  // validations
  // check if userId is same as owner
  // delete from db
  // return

  const userId = req.user?._id;
  const { videoId } = req.params;

  if (!userId || !videoId) {
    throw new ApiError(400, "UserId or VideoId is missing");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exists");
  }

  if (!video.owner.equals(userId)) {
    throw new ApiError(400, "Only owner can delete the video");
  }

  const videoPublicId = video.videoFilePublicId;
  const thumbnailPublicId = video.thumbnailPublicId;

  await Video.findByIdAndDelete(videoId);

  await deleteFromCloudinary(videoPublicId, "video");
  await deleteFromCloudinary(thumbnailPublicId, "image");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const getVideos = asyncHandler(async (req, res) => {
  let { page } = req.query;
  const pageSize = 20;

  if (!page) {
    page = 1;
  }

  page = parseInt(page, 10);

  const videos = await Video.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: (page - 1) * pageSize,
    },
    {
      $limit: pageSize,
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
              _id: 1,
              fullname: 1,
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
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getVideoById, uploadVideo, deleteVideo, getVideos };
