import express from "express";

import {
  createMeeting,
  getMeetings,
  getMeetingById,
} from "../controllers/meetingController.js";

import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", createMeeting);

router.get("/", getMeetings);
router.get("/:meetingId", getMeetingById);

export default router;
