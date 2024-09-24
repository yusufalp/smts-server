import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
