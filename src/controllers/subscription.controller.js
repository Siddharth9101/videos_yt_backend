import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const subscribe = asyncHandler(async (req, res) => {
  // get user id from req
  const subscriberId = req.user?._id;
  // get channel user id from params
  const { channelId } = req.body;
  // validations
  if (!subscriberId || !channelId)
    throw new ApiError(400, "subscriber id or channel id is missing");
  // check these ids exist in db or not
  const subscriber = await User.findById(subscriberId).select("-password");
  const channel = await User.findById(channelId).select("-password");

  if (!subscriber || !channel)
    throw new ApiError(404, "User or Channel does not exists");

  // create a new subscription doc
  const subscription = await Subscription.create({
    channel: channelId,
    subscriber: subscriberId,
  });

  // return
  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Subscribed successfully"));
});

export const unsubscribe = asyncHandler(async (req, res) => {
  // get userid
  // get channel id
  // validations
  // check subscriptions
  // delete subscription
  // return

  const userId = req.user?._id;
  const { channelId } = req.body;

  if (!userId || !channelId) {
    throw new ApiError(400, "userId or channel id missing");
  }

  const subscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });
  if (!subscription) {
    throw new ApiError(404, "subscription not found");
  }

  await Subscription.findOneAndDelete({
    subscriber: userId,
    channel: channelId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
});

export const getSubscriptions = asyncHandler(async (req, res) => {
  // get userid
  // validate
  // fetch all the subscription doc containing users id as subscriber
  // populate channel field in each field
  // return

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "User id is missing");
  }

  const subscriptions = await Subscription.aggregate([
    {
      $match: {
        subscriber: userId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscriptions, "Subscriptions fetched successfully")
    );
});
