import { Schema, model } from "mongoose";

const profileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
      },
    },
    email: { type: String, unique: true, required: true },
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
      mentor: { type: Schema.Types.ObjectId, ref: "Profile", default: null },
      coach: { type: Schema.Types.ObjectId, ref: "Profile", default: null },
    },
    // * active, inactive, graduated
    status: { type: String, default: "active" },
    // * admin, mentor, coach, mentee, alumni, guest
    role: { type: String, default: "mentee" },
    cohort: { type: Number },
    graduation: { type: Date },
  },
  { timestamps: true }
);

const Profile = model("Profile", profileSchema);

export default Profile;
