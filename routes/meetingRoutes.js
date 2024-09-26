import express from "express";

import {
  getMeetingsWith,
  createMeeting,
} from "../controllers/meetingController.js";

import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

// http://localhost:8080/api/meetings

router.use(authenticateToken);

router.get("/with", getMeetingsWith);

router.post("/", createMeeting);

export default router;
