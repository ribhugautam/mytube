import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.models.js";
import { uploadImage } from "../utils/cloudinary.js";

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
  const ownerId = req.user._id;

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

const getVideos = asyncHandler(async (req, res) => {
  const { onlyMyVideos } = req.body;

  let videos;

  if (onlyMyVideos === true) {
    videos = await Video.find({ owner: req.user._id });
  } else {
    videos = await Video.find();
  }

  if (!videos) {
    throw new ApiError(500, "No Videos Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const searchVideos = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new ApiError(400, "Query is Required");
  }

  const searchQuery = {
    $or: [
      { title: new RegExp(query, "i") },
      { description: new RegExp(query, "i") },
    ],
  };
  const videos = await Video.find(searchQuery).limit(50);
  if (!videos) {
    throw new ApiError(500, "No Videos Found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, videos.slice(0, 50), "Videos fetched successfully")
    );
});

export { uploadVideo, getVideos, searchVideos };
