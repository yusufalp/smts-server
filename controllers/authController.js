import bcrypt from "bcrypt";

import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import { decodeJwtToken, generateJwtToken } from "../utils/jwtUtils.js";
import CustomError from "../utils/CustomError.js";

export const signupUser = async (req, res, next) => {
  const { first, last, username, password } = req.body;

  try {
    if (!first || !username || !password) {
      throw new CustomError("Missing required fields", 400);
    }

    // TODO: add more validations here, especially for username and password

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    const newProfile = new Profile({
      userId: newUser._id,
      name: { first, last },
    });

    await newProfile.save();

    const accessToken = generateJwtToken(newUser, "access");
    const refreshToken = generateJwtToken(newUser, "refresh");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(201).json({
      success: { message: "A new user is created" },
      data: { accessToken, profile: newProfile },
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new CustomError("Incorrect username or password", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new CustomError("Incorrect username or password", 400);
    }

    const profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    const accessToken = generateJwtToken(user, "access");
    const refreshToken = generateJwtToken(user, "refresh");

    const decoded = decodeJwtToken(accessToken);
    const expiresAt = decoded.exp;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: { message: "Login successful" },
      data: { accessToken, expiresAt, profile },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res, next) => {
  try {
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: { message: "Logout successful" },
    });
  } catch (error) {
    next(error);
  }
};
