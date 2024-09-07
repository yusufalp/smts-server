import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    menteeId: { type: Schema.Types.ObjectId, ref: "User" },
    mentorId: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date },
    duration: { type: Number },
    notesBy: {
      mentee: { type: String },
      mentor: { type: String },
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
