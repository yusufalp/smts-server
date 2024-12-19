import express from "express";

import {
  createProfile,
  getAdvisors,
  getAssignedAdvisors,
  getAssignedMenteeByMenteeId,
  getAssignedMentees,
  getProfile,
  getProfileById,
  updateProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/profile", createProfile);

router.get("/advisors", getAdvisors);
router.get("/assigned/advisors", getAssignedAdvisors);
router.get("/assigned/mentee/:menteeId", getAssignedMenteeByMenteeId);
router.get("/assigned/mentees", getAssignedMentees);

router.get("/profile", getProfile);
router.get("/profile/:_id", getProfileById);

router.patch("/profile", updateProfile);

export default router;
