import express from "express";

import {
  getAttendance,
  markAttendance,
} from "../controllers/attendanceController";

const router = express.Router();

router.get("/:studentId", getAttendance);
router.post("/", markAttendance);

export default router;
