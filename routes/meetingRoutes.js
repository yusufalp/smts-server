import express from "express";

import {
  getMeetings,
  createMeeting,
} from "../controllers/meetingController.js";

import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getMeetings);

router.post("/", createMeeting);

export default router;
