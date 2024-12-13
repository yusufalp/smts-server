import express from "express";

import {
  createProfile,
  getAdvisors,
  getAssignedAdvisors,
  getAssignedMenteeById,
  getAssignedMentees,
  getProfileByUserId,
  updateProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/profile", createProfile);

router.get("/advisors", getAdvisors);
router.get("/assigned/advisors", getAssignedAdvisors);
router.get("/assigned/mentee/:_id", getAssignedMenteeById);
router.get("/assigned/mentees", getAssignedMentees);

router.get("/profile", getProfileByUserId);

router.patch("/profile", updateProfile);

export default router;
