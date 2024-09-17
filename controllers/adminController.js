import Meeting from "../models/meetingModel.js";
import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";

export const getAllMeetings = async (req, res, next) => {
  try {
    const allMeetings = await Meeting.find();

    res.status(200).json({
      success: { message: "All meetings retrieved successfully" },
      data: { allMeetings },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProfiles = async (req, res, next) => {
  try {
    const allProfiles = await Profile.find();

    res.status(200).json({
      success: { message: "All profiles is successfully retrieved" },
      data: { allProfiles },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();

    res.status(200).json({
      success: { message: "All users retrieved successfully" },
      data: { allUsers },
    });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  const { newRole, userId } = req.body;

  // TODO: add more validations here

  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { role: newRole },
      { new: true }
    );

    if (!profile) {
      throw new Error("Profile not found");
    }

    res.status(201).json({
      success: { message: "User role is updated successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCohort = (req, res, next) => {};

export const updateStatus = (req, res, next) => {};

export const updateGraduation = (req, res, next) => {};
