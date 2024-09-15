import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  getProfilesByUserId,
  updateAddress,
  updateEmail,
  updateLinks,
} from "../controllers/profileController.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/:userId", getProfilesByUserId);

router.post("/update-email", updateEmail);
router.post("/update-address", updateAddress);
router.post("/update-links", updateLinks);

export default router;
