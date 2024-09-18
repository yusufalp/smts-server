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
    address: {
      street: {
        line1: { type: String },
        line2: { type: String },
      },
      city: { type: String },
      state: { type: String },
      zip: { type: Number },
      country: { type: String },
    },
    links: {
      portfolio: { type: String },
      linkedin: { type: String },
      github: { type: String },
    },
    assigned: {
      mentor: { type: Schema.Types.ObjectId, ref: "User", default: null },
      coach: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
    cohort: { type: String },
    // * active, inactive, graduated
    status: { type: String, default: "active" },
    // * admin, mentor, coach, mentee, alumni
    role: { type: String, default: "mentee" },
    graduation: { type: Date },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
