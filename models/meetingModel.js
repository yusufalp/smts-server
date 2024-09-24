import { Schema, model } from "mongoose";

const meetingSchema = new Schema(
  {
    title: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "Profile" },
    date: { type: Date },
    duration: { type: Number },
    participants: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
    notes: [
      {
        by: { type: Schema.Types.ObjectId, ref: "Profile" },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Meeting = model("Meeting", meetingSchema);

export default Meeting;
