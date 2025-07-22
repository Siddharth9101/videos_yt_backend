import { ApiError } from "./ApiError.js";

export const validateRegisterBody = (fullname, username, email, password) => {
  // validation - not empty
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // email validation
  if (!email?.includes("@")) {
    throw new ApiError(400, "Invalid email");
  }
  // password validation
  if (password?.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
};

export const validateLoginBody = (username, email, password) => {
  if (!username && !email) {
    throw new ApiError(400, "Email or username is required");
  }
  if (!password || password === "") {
    throw new ApiError(400, "Password is required");
  }
};

export const validateChangePasswordBody = (oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "old password and new password is required");
  }
  if (oldPassword?.length < 6 || newPassword?.length < 6) {
    throw new ApiError(400, "Password length must be atleast 6");
  }
};

export const validateUpdateUserBody = (email, fullname) => {
  if (!email || !fullname) {
    throw new ApiError(400, "email and password are required");
  }

  // email validation
  if (!email?.includes("@")) {
    throw new ApiError(400, "Invalid email");
  }
};
