import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid userId");

  const { name } = req.body;
  if (!name) throw new ApiError(400, "name is required");

  await Playlist.create({
    name,
    owner: userId,
  });

  return res.status(201).json(new ApiResponse(201, {}, "Playlist created"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const playlists = await Playlist.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user?._id;

  if (
    !isValidObjectId(playlistId) ||
    !isValidObjectId(videoId) ||
    !isValidObjectId(userId)
  ) {
    throw new ApiError(400, "Invalid playlist/video/user id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist.owner.equals(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  await Playlist.findByIdAndUpdate(playlistId, {
    $push: {
      videos: videoId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video added successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user?._id;

  if (
    !isValidObjectId(playlistId) ||
    !isValidObjectId(videoId) ||
    !isValidObjectId(userId)
  ) {
    throw new ApiError(400, "Invalid playlist/video/user id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist.owner.equals(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  await Playlist.findByIdAndUpdate(playlistId, {
    $pull: {
      videos: new mongoose.Types.ObjectId(videoId),
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video removed successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(playlistId) || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid playlist/user id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist.owner.equals(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  await Playlist.findOneAndDelete({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name } = req.body;
  const userId = req.user?._id;

  if (!isValidObjectId(playlistId) || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid playlist/video/user id");
  }
  if (!name) throw new ApiError(400, "name is missing");

  const playlist = await Playlist.findById(playlistId);

  if (!playlist.owner.equals(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  await Playlist.findByIdAndUpdate(playlistId, {
    $set: {
      name,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
