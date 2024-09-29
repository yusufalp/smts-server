import Meeting from "../models/meetingModel.js";
import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";

import CustomError from "../utils/CustomError.js";

export const getAllMeetings = async (req, res, next) => {
  try {
    const allMeetings = await Meeting.find().lean();

    return res.status(200).json({
      success: { message: "All meetings retrieved successfully" },
      data: { allMeetings },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProfiles = async (req, res, next) => {
  try {
    const allProfiles = await Profile.find().lean();

    return res.status(200).json({
      success: { message: "All profiles is successfully retrieved" },
      data: { allProfiles },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find().lean();

    return res.status(200).json({
      success: { message: "All users retrieved successfully" },
      data: { allUsers },
    });
  } catch (error) {
    next(error);
  }
};

export const assignMentor = async (req, res, next) => {
  const { mentorId, userId } = req.body;

  try {
    if (!mentorId) {
      throw new CustomError("Mentor id is required", 400);
    }

    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const mentorProfile = await Profile.findOne({ userId: mentorId });

    if (!mentorProfile) {
      throw new CustomError("Mentor not found", 404);
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { "assigned.mentor": mentorProfile._id },
      { new: true }
    );

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: "Mentor updated successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const assignCoach = async (req, res, next) => {
  const { coachId, userId } = req.body;

  try {
    if (!coachId) {
      throw new CustomError("Coach id is required", 400);
    }

    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const coachProfile = await Profile.findOne({ userId: coachId });

    if (!coachProfile) {
      throw new CustomError("Coach not found", 404);
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { "assigned.coach": coachProfile._id },
      { new: true }
    );

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: "Coach updated successfully" },
      data: { profile },
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
      throw new CustomError("Profile not found", 404);
    }

    return res.status(201).json({
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
