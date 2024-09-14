import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";
import { getAllMeetings, getAllProfiles } from "../controllers/adminController.js";

const router = express.Router();

// need admin permission
router.get("/meetings", authenticateToken, authorizeAdmin, getAllMeetings);

router.get("/profiles", authenticateToken, authorizeAdmin, getAllProfiles);

export default router;
