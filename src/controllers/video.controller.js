import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.models.js";
import { uploadImage } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is Required");
  }

  if (!description) {
    throw new ApiError(400, "Description is Required");
  }

  const videoLocal = await req.files?.video?.[0].path;
  const thumbnailLocal = await req.files?.thumbnail?.[0].path;

  if (!videoLocal || !thumbnailLocal) {
    throw new ApiError(500, "Thumbnail or Video not added");
  }

  const videoFile = await uploadImage(videoLocal);
  const thumbnail = await uploadImage(thumbnailLocal);
  const owner = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ]);

  if (owner.length === 0) {
    throw new ApiError(404, "Owner not found");
  }

  const ownerId = owner[0]._id;

  const duration = videoFile.duration;

  const videoData = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: ownerId,
    title: title,
    description: description,
    duration: duration,
  });

  if (!videoData) {
    throw new ApiError(500, "Error while uploading to Database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoData, "File Uploaded Successfully"));
});

export { uploadVideo };
