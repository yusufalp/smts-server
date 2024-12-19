import express from "express";

import { authorizeAdmin } from "../middlewares/authorizeRoles.js";
import {
  getAllMeetings,
  getAllProfiles,
  getProfileById,
  updateAdvisor,
  updateProfileField,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authorizeAdmin);

router.get("/meetings", getAllMeetings);
router.get("/profiles", getAllProfiles);
router.get("/profiles/profile/:_id", getProfileById);

router.post("/advisor", updateAdvisor);

router.post("/profile", updateProfileField);

export default router;
