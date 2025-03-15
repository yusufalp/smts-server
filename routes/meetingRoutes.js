import express from "express";

import {
  createMeeting,
  deleteMeeting,
  getMeetingById,
  getMeetings,
  updateMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();

// POST /api/meetings
// Create a new meeting.
router.post("/", createMeeting);

// DELETE /api/meetings/:id
// Cancel or delete a specific own meeting.
router.delete("/:_id", deleteMeeting);

// GET /api/meetings
// Retrieves a list of own meetings.
router.get("/", getMeetings);

// GET /api/meetings/:id
// Retrieve details for a specific own meeting.
router.get("/:_id", getMeetingById);

// PATCH /api/meetings/:id
// Update details of a specific own meeting.
router.patch("/:_id", updateMeeting);

export default router;
