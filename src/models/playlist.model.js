import { Schema, model } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    videos: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Video",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Playlist = model("Playlist", playlistSchema);
