import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  createPlaylistAndAddVideo,
  getPlaylist,
  getAllPlaylists,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createPlaylist);
router.route("/create-and-add-video").post(verifyJWT, createPlaylistAndAddVideo);
router.route("/add-video").post(verifyJWT, addVideoToPlaylist);
router.route("/get").get(verifyJWT, getPlaylist);
router.route("/all").get(verifyJWT, getAllPlaylists);
router.route("/delete").delete(verifyJWT, deletePlaylist);
router.route("/remove-video").delete(verifyJWT, removeVideoFromPlaylist);

export default router;
