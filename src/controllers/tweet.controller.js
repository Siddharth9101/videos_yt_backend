import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { content } = req.body;

  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid userid");
  if (!content) throw new ApiError(400, "name is required");

  const tweet = await Tweet.create({
    owner: userId,
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userid");
  }

  const tweets = await Tweet.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;
  const { content } = req.body;

  if (!isValidObjectId(userId) || !isValidObjectId(tweetId))
    throw new ApiError(400, "Invalid user/tweet id");
  if (!content) throw new ApiError(400, "Content is missing");

  const tweet = await Tweet.findById(tweetId);

  if (!tweet.owner.equals(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  await Tweet.findByIdAndUpdate(tweetId, {
    $set: {
      content,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(userId) || !isValidObjectId(tweetId))
    throw new ApiError(400, "Invalid user/tweet id");

  const tweet = await Tweet.findById(tweetId);

  if (!tweet.owner.equals(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
