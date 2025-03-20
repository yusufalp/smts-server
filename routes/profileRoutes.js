import express from "express";

import {
  createProfile,
  deleteProfile,
  getAllAdvisors,
  getAllProfiles,
  getAssignedAdvisors,
  getAssignedLearnerById,
  getAssignedLearners,
  getProfile,
  getProfileById,
  updateProfile,
  updateProfileById,
} from "../controllers/profileController.js";

import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// POST /api/profiles/profile
// Creates a new profile.
router.post("/profile", createProfile);

// GET /api/profiles/profile
// Retrieves a list of names and emails of all mentors and coaches
router.get("/advisors", getAllAdvisors);

// GET /api/profiles/assigned/advisors
// Retrieves a list of advisors assigned to own account
router.get("/assigned/advisors", getAssignedAdvisors);

// GET /api/profiles/assigned/learner/:_id
// Retrieves a specific learner assigned to own account
router.get(
  "/assigned/learners/:_id",
  authorizeRoles("admin", "mentor", "coach"),
  getAssignedLearnerById
);

// GET /api/profiles/assigned/learners
// Retrieves a list of learners assigned to own account
router.get(
  "/assigned/learners",
  authorizeRoles("admin", "mentor", "coach"),
  getAssignedLearners
);

// GET /api/profiles/profile
// Retrieves own profile.
router.get("/profile", getProfile);

// PATCH /api/profiles/profile
// Updates own profile.
router.patch("/profile", updateProfile);

// * ADMIN AUTHORIZATION BELOW

// GET /api/admin/profiles
// Retrieves all profiles.
// Query fields: first name, last name, status, role
// Pagination is applied
router.get("/profiles", getAllProfiles);

// GET /api/admin/profiles/:_id
// Retrieves profile details by ID.
router.get("/profiles/:_id", getProfileById);

// PATCH /api/admin/profiles/:_id
// Updates a profile by ID.
// Query fields: assigned, status, role, cohort, graduation date.
router.patch("/profiles/:_id", updateProfileById);

// DELETE /api/admin/profiles/:id
// Deletes a profile by ID.
router.delete("/profiles/:_id", deleteProfile);

export default router;
