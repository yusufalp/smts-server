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
    assigned: {
      mentor: { type: Schema.Types.ObjectId, ref: "User", default: null },
      coach: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
    links: {
      portfolio: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      github: { type: String },
    },
    // * active, inactive, graduated
    status: { type: String, default: "active" },
    graduation: { type: Date },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
