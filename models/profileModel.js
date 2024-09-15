import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
      },
    },
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
      github: { type: String },
    },
    // * active, inactive, graduated
    status: { type: String, default: "active" },
    // * admin, mentor, mentee, coach, alumni
    role: { type: String, default: "mentee" },
    graduation: { type: Date },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
