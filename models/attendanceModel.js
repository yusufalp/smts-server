import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      required: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default model("Attendance", AttendanceSchema);
