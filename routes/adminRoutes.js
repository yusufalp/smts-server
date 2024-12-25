import express from "express";

import { authorizeAdmin } from "../middlewares/authorizeRoles.js";

import {
  deleteProfile,
  getAllProfiles,
  getProfileById,
  updateProfileAttributes,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authorizeAdmin);

// GET /api/admin/profiles
// Retrieves all profiles.
// Query fields: status, role
// Pagination is applied
router.get("/profiles", getAllProfiles);

// GET /api/admin/profiles/:_id
// Retrieves profile details by ID.
router.get("/profiles/:_id", getProfileById);

// PATCH /api/admin/profiles/:_id
// Updates a profile by ID.
// Query fields: status, role, cohort, graduation date.
router.patch("/profiles/:_id", updateProfileAttributes);

// DELETE /api/admin/profiles/:id
// Deletes a profile by ID.
router.delete("/profiles/:_id", deleteProfile);

export default router;
