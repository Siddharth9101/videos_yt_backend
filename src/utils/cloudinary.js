import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return new Error("Please provide file path!");
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "yt_backend",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // removing localfile as the upload operation got failed
    fs.unlinkSync(localFilePath);
    throw new ApiError(500, "Error while uploading image on cloudinary");
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return;
  } catch (error) {
    throw new ApiError(500, "Error while deleting image from cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
