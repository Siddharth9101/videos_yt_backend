import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscriptions,
  subscribe,
  unsubscribe,
} from "../controllers/subscription.controller.js";

const router = Router();

// secured routes
router.route("/subscribe").post(verifyJWT, subscribe);
router.route("/unsubscribe").post(verifyJWT, unsubscribe);
router.route("/").get(verifyJWT, getSubscriptions);

export default router;
