import mongoose, { connect } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  let { page = 1, limit = 10 } = req.query;
  // check all fields are present
  // fetch filtered comments where video matches videoId
  // return

  if ([videoId, page, limit].some((field) => field === "")) {
    throw new ApiError(400, "All fields are required");
  }

  page = parseInt(page);
  limit = parseInt(limit);

  const comments = await Comment.aggregate([
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) },
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
        _id: 1,
        content: 1,
        owner: 1,
        createdAt: 1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  /**
   * get userId, video id and content
   * validation
   * check if user and video exists
   * create comment entry in db
   * return
   */

  const userId = req.user?._id;
  const { videoId } = req.params;
  const { content } = req.body;

  if (!userId || !videoId || !content) {
    throw new ApiError(400, "All fields are required");
  }

  const [user, video] = await Promise.all([
    User.findById(userId),
    Video.findById(videoId),
  ]);

  if (!user || !video) {
    throw new ApiError(404, "User/Video does not exist");
  }

  await Comment.create({
    content,
    video: video?._id,
    owner: user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  /**
   * get videoId, userId and content
   * validations
   * check if user and comment exists
   * update the comment
   * return
   */

  const userId = req.user?._id;
  const { commentId } = req.params;
  const { content } = req.body;

  if (!userId || !commentId || !content) {
    throw new ApiError(400, "All fields are required");
  }

  const [user, comment] = await Promise.all([
    User.findById(userId),
    Comment.findById(commentId),
  ]);

  if (!user || !comment) {
    throw new ApiError(404, "User/Video does not exist");
  }

  if (!comment.owner.equals(user._id)) {
    throw new ApiError(401, "Unauthorized");
  }

  await Comment.findByIdAndUpdate(comment?._id, {
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  /**
   * get userId, commentId
   * validations
   * check if user and comment exists
   * check is user is the owner of comment
   * delete comment
   * return
   *  */

  const userId = req.user?._id;
  const { commentId } = req.params;

  if (!userId || !commentId) {
    throw new ApiError(400, "All fields are required");
  }

  const [user, comment] = await Promise.all([
    User.findById(userId),
    Comment.findById(commentId),
  ]);

  if (!user || !comment) {
    throw new ApiError(404, "User/Video does not exist");
  }

  if (!comment.owner.equals(user._id)) {
    throw new ApiError(401, "Unauthorized");
  }

  await Comment.findByIdAndDelete(comment._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
