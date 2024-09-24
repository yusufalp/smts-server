import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  getAssignedAdvisors,
  getAssignedMentees,
  getProfileByUserId,
  updateAddress,
  updateEmail,
  updateLinks,
} from "../controllers/profileController.js";

const router = express.Router();

// http://localhost:8080/api/profiles

router.use(authenticateToken);

router.get("/advisors", getAssignedAdvisors);
router.get("/mentees", getAssignedMentees);

router.get("/:userId", getProfileByUserId);

router.post("/update-email", updateEmail);
router.post("/update-address", updateAddress);
router.post("/update-links", updateLinks);

export default router;
