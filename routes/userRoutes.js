import express from "express";

import {
  loginUser,
  logoutUser,
  signupUser,
  updateRole,
} from "../controllers/userController.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/update-role", authenticateToken, authorizeAdmin, updateRole);

export default router;
