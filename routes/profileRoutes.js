import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  getAssignedAdvisors,
  getAssignedMentees,
  getAssignedMenteeById,
  getAdvisors,
  getProfileByUserId,
  updateProfile,
} from "../controllers/profileController.js";
import { authorizeAdvisor } from "../middlewares/authorizeAdmin.js";

const router = express.Router();

// Protect all routes with token authentication
router.use(authenticateToken);

router.get("/advisors", getAdvisors);
router.get("/assigned/advisors", getAssignedAdvisors);
router.get("/assigned/mentees", getAssignedMentees);
router.get("/assigned/mentee/:_id", getAssignedMenteeById);

router.patch("/profile", updateProfile);

// Only advisors (mentors/coaches) can access specific user profiles
router.use(authorizeAdvisor);
router.get("/:userId", getProfileByUserId);

export default router;
