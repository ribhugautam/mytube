import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getUserInfo,
  updateAvatarImage,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";


const router = Router();

//Routes
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

//Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-password").put(verifyJWT, changeCurrentPassword);
router.route("/update-account-details").put(verifyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .put(verifyJWT, upload.single("avatar"), updateAvatarImage);
router
  .route("/update-cover")
  .put(verifyJWT, upload.single("cover"), updateCoverImage);
router.route("/get-user-info").get(verifyJWT, getUserInfo);
router.route("/get-channel-profile").get(verifyJWT, getUserChannelProfile);
router.route("/get-watch-history").get(verifyJWT, getWatchHistory);

export default router;
