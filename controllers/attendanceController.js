import Attendance from "../models/attendanceModel.js"

export const getAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({
      student: req.params.studentId,
    });
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { student, status } = req.body;
    const attendance = new Attendance({ student, status });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { getAttendance, markAttendance };
