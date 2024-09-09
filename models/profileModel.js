import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String },
    cohort: { type: String },
    address: {
      street: {
        line1: { type: String },
        line2: { type: String },
      },
      city: { type: String },
      state: { type: String },
      zip: { type: Number },
      country: { type: String, default: "US" },
    },
    socials: {
      linkedin: { type: String },
      twitter: { type: String },
      github: { type: String },
    },
    portfolio: { type: String },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
