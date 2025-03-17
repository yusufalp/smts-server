import express from "express";

import {
  getAttendance,
  markAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/:studentId", getAttendance);
router.post("/", markAttendance);

export default router;
