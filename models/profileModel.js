import { Schema, model } from "mongoose";

import { ROLES } from "../constants/roles.js";
import { STATUSES } from "../constants/statuses.js";

const profileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    name: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      middleName: {
        type: String,
        trim: true,
        default: "",
      },
    },
    email: { type: String, unique: true, required: true, trim: true },
    phoneNumber: { type: Number },
    address: {
      street: {
        line1: { type: String },
        line2: { type: String, default: "" },
      },
      city: { type: String },
      state: { type: String },
      postalCode: { type: Number },
      country: { type: String },
    },
    links: {
      portfolioUrl: { type: String },
      linkedinUrl: { type: String },
      githubUrl: { type: String },
    },
    bio: { type: String },
    assigned: {
      mentor: { type: Schema.Types.ObjectId, ref: "Profile", default: null },
      coach: { type: Schema.Types.ObjectId, ref: "Profile", default: null },
    },
    status: {
      type: String,
      default: "active",
      enum: Object.keys(STATUSES),
    },
    role: {
      type: String,
      default: "mentee",
      enum: Object.keys(ROLES),
    },
    cohort: { type: Number },
    graduationDate: { type: Date },
  },
  { timestamps: true }
);

const Profile = model("Profile", profileSchema);

export default Profile;
