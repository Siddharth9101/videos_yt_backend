import { Schema, model } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: [true, "video is required"],
    },
    videoFilePublicId: {
      type: String,
      required: [true, "video public id is required"],
    },
    thumbnail: {
      type: String, // cloudinary url
      required: [true, "thumbnail is required"],
    },
    thumbnailPublicId: {
      type: String,
      required: [true, "Thumbnail public id is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

videoSchema.plugin(aggregatePaginate);

export const Video = model("Video", videoSchema);
