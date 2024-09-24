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

export const assignMentor = async (req, res, next) => {
  const { mentorId, userId } = req.body;

  try {
    if (!mentorId) {
      throw new Error("Mentor id is required");
    }

    if (!userId) {
      throw new Error("User id is required");
    }

    const mentorProfile = await Profile.findOne({ userId: mentorId });

    if (!mentorProfile) {
      throw new Error("Mentor not found");
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { "assigned.mentor": mentorProfile._id },
      { new: true }
    );

    if (!profile) {
      throw new Error("Profile not found");
    }

    res.status(200).json({
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
      throw new Error("Coach id is required");
    }

    if (!userId) {
      throw new Error("User id is required");
    }

    const coachProfile = await Profile.findOne({ userId: coachId });

    if (!coachProfile) {
      throw new Error("Coach not found");
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { "assigned.coach": coachProfile._id },
      { new: true }
    );

    if (!profile) {
      throw new Error("Profile not found");
    }

    res.status(200).json({
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
