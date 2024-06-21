import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  subscribe,
  unsubscribe,
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/subscribe").post(verifyJWT, subscribe);
router.route("/unsubscribe").post(verifyJWT, unsubscribe);

export default router;
