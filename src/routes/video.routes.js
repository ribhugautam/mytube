import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo, getVideos, searchVideos } from "../controllers/video.controller.js";

const router = Router();

router.route("/upload").post(verifyJWT, upload.fields([
    {name: "video", maxCount:1},
    {name: "thumbnail", maxCount:1}
]), uploadVideo)

router.route("/get-videos").get(verifyJWT, getVideos)
router.route("/search").get(verifyJWT, searchVideos)

export default router
