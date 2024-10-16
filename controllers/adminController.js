import Meeting from "../models/meetingModel.js";
import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";

import CustomError from "../utils/CustomError.js";
import { ROLES } from "../enums/role.js";
import { STATUS } from "../enums/status.js";

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

export const updateAdvisor = async (req, res, next) => {
  const { advisorId, userId } = req.body;

  try {
    if (!advisorId) {
      throw new CustomError("Advisor id is required", 400);
    }

    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const advisorProfile = await Profile.findOne(
      { userId: advisorId },
      "_id role"
    );

    if (!advisorProfile) {
      throw new CustomError("Advisor not found", 404);
    }

    const advisorRole = advisorProfile.role;

    if (
      ROLES[advisorRole].key !== "mentor" &&
      ROLES[advisorRole].key !== "coach"
    ) {
      throw new CustomError("Person is not an advisor", 400);
    }

    const advisorConfig = {
      mentor: { "assigned.mentor": advisorProfile._id },
      coach: { "assigned.coach": advisorProfile._id },
    };

    const updateData = advisorConfig[advisorRole];

    const profile = await Profile.findOneAndUpdate({ userId }, updateData, {
      new: true,
    });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: "Advisor updated successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileField = async (req, res, next) => {
  const { userId, field, value } = req.body;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    if (!field || !value) {
      throw new CustomError("Field and its value is required", 400);
    }

    if (field === "status") {
      if (!STATUS[value]) {
        throw new CustomError("Invalid status value", 400);
      }
    } else if (field === "role") {
      if (!ROLES[value]) {
        throw new CustomError("Invalid role value", 400);
      }
    }

    const updateData = { [field]: value };

    const profile = await Profile.findOneAndUpdate({ userId }, updateData, {
      new: true,
    });

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: `${field} updated successfully` },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};
