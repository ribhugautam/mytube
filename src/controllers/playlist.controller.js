import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;
  if (!name) {
    throw new ApiError(400, "Name is Required");
  }

  if (!description) {
    throw new ApiError(400, "Description is Required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: userId,
  });

  if (!playlist) {
    throw new ApiError(500, "Playlist not created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const createPlaylistAndAddVideo = asyncHandler(async (req, res) => {
  const { name, description, videoId } = req.body;
  const userId = req.user._id;
  if (!name) {
    throw new ApiError(400, "Name is Required");
  }

  if (!description) {
    throw new ApiError(400, "Description is Required");
  }

  if (!videoId) {
    throw new ApiError(400, "Video Id is Required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: userId,
  });

  if (!playlist) {
    throw new ApiError(500, "Playlist not created");
  }

  playlist.videos.push(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const userId = req.user._id;
  if (!playlistId) {
    throw new ApiError(400, "Playlist Id is Required");
  }

  if (!videoId) {
    throw new ApiError(400, "Video Id is Required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already added to playlist");
  }

  playlist.videos.push(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const userId = req.user._id;
  if (!playlistId) {
    throw new ApiError(400, "Playlist Id is Required");
  }

  if (!videoId) {
    throw new ApiError(400, "Video Id is Required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  } else if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not added to playlist");
  }

  if (playlist.videos.length === 1) {
    await playlist.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Playlist and Video deleted successfully")
      );
  }

  playlist.videos = playlist.videos.filter((id) => id !== videoId);
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video deleted from playlist successfully")
    );
});

const getPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.query;
  if (!playlistId) {
    throw new ApiError(400, "Playlist Id is Required");
  }
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const getAllPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find();
  if (!playlists) {
    throw new ApiError(404, "Playlists not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.query;
  if (!playlistId) {
    throw new ApiError(400, "Playlist Id is Required");
  }
  const playlist = await Playlist.findByIdAndDelete(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

export {
  createPlaylist,
  addVideoToPlaylist,
  createPlaylistAndAddVideo,
  getPlaylist,
  getAllPlaylists,
  deletePlaylist,
  removeVideoFromPlaylist,
};
