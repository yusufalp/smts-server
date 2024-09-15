import express from "express";

import { authenticateToken } from "../middlewares/authenticateToken.js";
import { getUserById } from "../controllers/userControllers.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/:_id", getUserById);

export default router;
