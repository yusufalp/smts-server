import express from "express";

import {
  createProfile,
  deleteProfile,
  getAdvisors,
  getAssignedAdvisors,
  getAssignedMenteeByMenteeId,
  getAssignedMentees,
  updateProfile,
  getProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/advisors", getAdvisors);
router.get("/assigned/advisors", getAssignedAdvisors);
router.get("/assigned/mentee/:menteeId", getAssignedMenteeByMenteeId);
router.get("/assigned/mentees", getAssignedMentees);

// TODO: Move to admin routes
// GET /api/profiles
// Retrieves all profiles.
// router.get("/", getAllProfiles);

// POST /api/profiles
// Creates a new profile.
router.post("/profile", createProfile);

// GET /api/profiles/:id
// Retrieves profile details by ID.
router.get("/profile", getProfile);

// PATCH /api/profiles/:id
// Updates a profile by ID.
router.patch("/profile", updateProfile);

// DELETE /api/profiles/:id
// Deletes a profile by ID.
router.delete("/profile/:_id", deleteProfile);

export default router;
