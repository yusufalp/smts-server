import express from "express";

import {
  createProfile,
  getAllAdvisors,
  getAssignedAdvisors,
  getAssignedLearnerById,
  getAssignedLearners,
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// POST /api/profiles/profile
// Creates a new profile.
router.post("/profile", createProfile);

// GET /api/profiles/profile
// Retrieve a list of all mentors and coaches
router.get("/advisors", getAllAdvisors);

// GET /api/profiles/assigned/advisors
// Retrieves a list of own advisors
router.get("/assigned/advisors", getAssignedAdvisors);

router.get("/assigned/learner/:_id", getAssignedLearnerById);

// GET /api/profiles/assigned/learners
// Retrieves a list of own learners
router.get("/assigned/learners", getAssignedLearners);

// GET /api/profiles/profile
// Retrieves own profile.
router.get("/profile", getProfile);

// PATCH /api/profiles/profile
// Updates own profile.
router.patch("/profile", updateProfile);

export default router;
