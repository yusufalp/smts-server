import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";
import {
  getAllMeetings,
  getAllProfiles,
  getAllUsers,
  updateAdvisor,
  updateProfileField,
} from "../controllers/adminController.js";

const router = express.Router();

// http://localhost:8080/api/admin

router.use(authenticateToken);
router.use(authorizeAdmin);

// need admin permission
router.get("/meetings", getAllMeetings);
router.get("/profiles", getAllProfiles);
router.get("/users", getAllUsers);

router.post("/advisor", updateAdvisor);

router.post("/profile", updateProfileField);

export default router;
