import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  getProfile,
  getMenteesByAdvisorId,
  updateAddress,
  updateEmail,
  updateLinks,
} from "../controllers/profileController.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getProfile);
router.get("/:advisorId/:advisorRole", getMenteesByAdvisorId);

router.post("/update-email", updateEmail);
router.post("/update-address", updateAddress);
router.post("/update-links", updateLinks);

export default router;
