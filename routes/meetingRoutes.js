import express from "express";

import {
  getAllMeetings,
  getMeetingsByUserId,
  createMeeting,
} from "../controllers/meetingController.js";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";

const router = express.Router();

// need admin permission
router.get("/all", authenticateToken, authorizeAdmin, getAllMeetings);

router.get("/", authenticateToken, getMeetingsByUserId);

router.post("/", authenticateToken, createMeeting);

export default router;
