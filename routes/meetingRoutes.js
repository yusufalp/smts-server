import express from "express";

import {
  getMeetingsByUserId,
  createMeeting,
} from "../controllers/meetingController.js";

import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.get("/", authenticateToken, getMeetingsByUserId);

router.post("/", authenticateToken, createMeeting);

export default router;
