import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    title: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    date: {type: Date},
    duration: { type: Number },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    notes: [
      {
        by: { type: Schema.Types.ObjectId, ref: "User" },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
