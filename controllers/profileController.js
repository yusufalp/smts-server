import Profile from "../models/profileModel.js";
import CustomError from "../utils/CustomError.js";

export const getAssignedAdvisors = async (req, res, next) => {
  const userId = req.user._id;
  // ? if no field is provided, is it undefined or empty string
  // ? Do you want to assign a default value of name? Anything at all?
  const field = req.query.field || "name";

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const advisors = await Profile.findOne({ userId }, "assigned")
      .populate("assigned.mentor", field)
      .populate("assigned.coach", field)
      .lean();

    if (!advisors) {
      throw new CustomError("Assigned advisors not found", 404);
    }

    return res.status(200).json({
      success: { message: "Advisors populated successfully" },
      data: advisors,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedMentees = async (req, res, next) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const profile = await Profile.findOne({ userId }, "_id");

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    const mentees = await Profile.find({
      status: "active",
      $or: [
        { "assigned.mentor": profile._id },
        { "assigned.coach": profile._id },
      ],
    }).lean();

    if (!mentees) {
      throw new CustomError("Mentees not found", 404);
    }

    return res.status(200).json({
      success: { message: "Mentees retrieved successfully" },
      data: { mentees },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfilesByRole = async (req, res, next) => {
  const { role, field = "" } = req.query;

  try {
    if (!role) {
      throw new CustomError("Role is required", 400);
    }

    const roleConditions = {
      advisor: { $or: [{ role: "mentor" }, { role: "coach" }] },
      learner: { $or: [{ role: "mentee" }, { role: "alumni" }] },
    };

    const queryCondition = roleConditions[role] || { role };

    const profiles = await Profile.find(queryCondition, field).lean();

    if (!profiles.length) {
      throw new CustomError(`Profiles with ${role} role not found`, 404);
    }

    return res.status(200).json({
      success: { message: "Profiles by role found" },
      data: { profiles },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const profile = await Profile.findOne({ userId }).lean();

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: "Profile found successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileField = async (req, res, next) => {
  const userId = req.user._id;

  const { field, value } = req.body;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    if (!field || !value) {
      throw new CustomError(`${field} and its value is required`, 400);
    }

    const updateData = {};

    if (field === "address") {
      updateData[field] = {
        street: {
          line1: value.line1,
          line2: value.line2,
        },
        city: value.city,
        state: value.state,
        zip: value.zip,
        country: "US",
      };
    } else if (field === "links") {
      updateData[field] = {
        portfolio: value.portfolio,
        linkedin: value.linkedin,
        github: value.github,
      };
    } else if (field === "name") {
      if (!first) {
        throw new CustomError("First name is required", 400);
      }
      updateData[field] = {
        first: value.first,
        last: value.last,
      };
    } else {
      updateData[field] = value;
    }

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
