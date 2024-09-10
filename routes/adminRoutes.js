import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
import { getAllMeetings, getAllProfiles } from "../controllers/adminController";

const router = express.Router();

// need admin permission
router.get("/meetings", authenticateToken, authorizeAdmin, getAllMeetings);

router.get("/profiles", authenticateToken, authorizeAdmin, getAllProfiles);

export default router;
