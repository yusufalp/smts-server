import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";
import {
  getAllMeetings,
  getAllProfiles,
  getAllUsers,
  updateRole,
  updateCohort,
  updateStatus,
  updateGraduation,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeAdmin);

// need admin permission
router.get("/meetings", getAllMeetings);
router.get("/profiles", getAllProfiles);
router.get("/users", getAllUsers);

router.post("/update-role", updateRole);
router.post("/update-cohort", updateCohort);
router.post("/update-status", updateStatus);
router.post("/update-graduation", updateGraduation);

export default router;
