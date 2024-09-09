import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
      },
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, default: "mentee" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
