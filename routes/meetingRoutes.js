import express from "express";

import {
  getMeetingsByUserId,
  createMeeting,
} from "../controllers/meetingController.js";

import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getMeetingsByUserId);

router.post("/", createMeeting);

export default router;
