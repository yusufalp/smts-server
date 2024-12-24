import express from "express";

import {
  createProfile,
  deleteProfile,
  getAdvisors,
  getAssignedAdvisors,
  getAssignedMenteeByMenteeId,
  getAssignedMentees,
  updateProfile,
  getAllProfiles,
  getProfileById,
} from "../controllers/profileController.js";

const router = express.Router();

// POST /api/profiles
// Creates a new profile.
router.post("/", createProfile);

// DELETE /api/profiles/:id
// Deletes a profile by ID.
router.delete("/:_id", deleteProfile);

router.get("/advisors", getAdvisors);
router.get("/assigned/advisors", getAssignedAdvisors);
router.get("/assigned/mentee/:menteeId", getAssignedMenteeByMenteeId);
router.get("/assigned/mentees", getAssignedMentees);

// GET /api/profiles
// Retrieves all profiles.
router.get("/", getAllProfiles);

// GET /api/profiles/:id
// Retrieves profile details by ID.
router.get("/:_id", getProfileById);

// PATCH /api/profiles/:id
// Updates a profile by ID.
router.patch("/profile", updateProfile);

export default router;
