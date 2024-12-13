import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeAdmin } from "../middlewares/authorizeRoles.js";
import {
  getAllMeetings,
  getAllProfiles,
  updateAdvisor,
  updateProfileField,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeAdmin);

// need admin permission
router.get("/meetings", getAllMeetings);
router.get("/profiles", getAllProfiles);

router.post("/advisor", updateAdvisor);

router.post("/profile", updateProfileField);

export default router;
