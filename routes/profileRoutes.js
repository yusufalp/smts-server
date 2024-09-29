import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  getProfileByUserId,
  getProfilesByRole,
  getAssignedAdvisors,
  getAssignedMentees,
  updateProfileField,
} from "../controllers/profileController.js";

const router = express.Router();

// http://localhost:8080/api/profiles

router.use(authenticateToken);

router.get("/profile", getProfilesByRole);

router.get("/assigned/advisors", getAssignedAdvisors);
router.get("/assigned/mentees", getAssignedMentees);

router.get("/:userId", getProfileByUserId);

router.patch("/profile", updateProfileField);

export default router;
