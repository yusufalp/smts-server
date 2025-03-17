import { Schema, model } from "mongoose";

const meetingSchema = new Schema(
  {
    title: { type: String, required: true },
    organizer: {
      profileId: { type: String },
      email: { type: String },
      name: {
        firstName: { type: String },
        lastName: { type: String },
      },
    },
    participants: [
      {
        profileId: { type: String },
        email: { type: String },
        name: {
          firstName: { type: String },
          lastName: { type: String },
        },
      },
    ],
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    meetingStatus: {
      type: String,
      default: "scheduled",
      enum: ["scheduled", "cancelled", "completed"],
    },
    summary: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Meeting = model("Meeting", meetingSchema);

export default Meeting;
