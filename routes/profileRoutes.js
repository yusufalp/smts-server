import express from "express";

import {
  createProfile,
  getAssignedAdvisors,
  getAssignedLearners,
  updateProfile,
  getProfile,
  getAssignedMenteesByMenteeId,
} from "../controllers/profileController.js";

const router = express.Router();

// GET /api/profiles/assigned/advisors
// Retrieves a list of own advisors
router.get("/assigned/advisors", getAssignedAdvisors);

// GET /api/profiles/assigned/learners
// Retrieves a list of own learners
router.get("/assigned/learners", getAssignedLearners);

// POST /api/profiles/profile
// Creates a new profile.
router.post("/profile", createProfile);

// GET /api/profiles/profile
// Retrieves own profile.
router.get("/profile", getProfile);

// PATCH /api/profiles/profile
// Updates own profile.
router.patch("/profile", updateProfile);

router.get("/assigned/mentees/:menteeId", getAssignedMenteesByMenteeId);
export default router;
