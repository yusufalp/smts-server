import { Schema, model } from "mongoose";

const profileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
      middleName: {
        type: String,
      },
    },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: Number },
    address: {
      street: {
        line1: { type: String },
        line2: { type: String },
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
      mentor: { type: Schema.Types.ObjectId, ref: "Profile" },
      coach: { type: Schema.Types.ObjectId, ref: "Profile" },
    },
    // * active, inactive, graduated
    profileStatus: { type: String, default: "active" },
    // * admin, mentor, coach, mentee, alumni, guest, applicant, prospective
    role: { type: String, default: "mentee" },
    cohort: { type: Number },
    graduationDate: { type: Date },
  },
  { timestamps: true }
);

const Profile = model("Profile", profileSchema);

export default Profile;
