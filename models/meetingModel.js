import { Schema, model } from "mongoose";

const meetingSchema = new Schema(
  {
    title: { type: String, required: true },
    learner: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    advisor: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const Meeting = model("Meeting", meetingSchema);

export default Meeting;
