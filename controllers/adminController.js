import Meeting from "../models/meetingModel.js";
import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";

import { ROLES } from "../enums/roles.js";
import { STATUSES } from "../enums/statuses.js";

import CustomError from "../utils/CustomError.js";

export const getAllMeetings = async (req, res, next) => {
  const { title, learner, advisor, date, page = 1, limit = 5 } = req.query;

  const filters = {};

  if (title) {
    filters.title = title;
  }

  if (learner) {
    filters.learner = learner;
  }

  if (advisor) {
    filters.advisor = advisor;
  }

  if (date) {
    filters.date = date;
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 100);

  try {
    const meetings = await Meeting.find(filters)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate("learner", "name")
      .populate("advisor", "name")
      .lean();

    if (!meetings) {
      throw new CustomError("No meetings found", 404);
    }

    const totalCount = await Meeting.countDocuments(filters);

    return res.status(200).json({
      success: { message: "All meetings retrieved successfully" },
      data: {
        meetings,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          currentPage: pageNum,
          pageSize,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProfiles = async (req, res, next) => {
  const { status, page = 1, limit = 5 } = req.query;

  const filters = {};

  if (status && status !== "all") {
    if (STATUSES[status]) {
      filters.status = STATUSES[status].key;
    } else {
      throw new CustomError(`Invalid status value`, 400);
    }
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 100);

  try {
    const profiles = await Profile.find(filters)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean();

    if (!profiles) {
      throw new CustomError("No profiles found", 404);
    }

    const totalCount = await Profile.countDocuments(filters);

    return res.status(200).json({
      success: { message: "All profiles is successfully retrieved" },
      data: {
        profiles,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          currentPage: pageNum,
          pageSize,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().lean();

    return res.status(200).json({
      success: { message: "All users retrieved successfully" },
      data: { users },
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
      if (!STATUSES[value]) {
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
