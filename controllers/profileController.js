import Profile from "../models/profileModel.js";
import CustomError from "../utils/CustomError.js";

export const createProfile = async (req, res, next) => {
  const userId = req.user._id;
  const { firstName, lastName, email } = req.body;

  try {
    if (!firstName || !lastName || !email) {
      throw new CustomError(`Missing required fields`, 400);
    }

    const profile = new Profile({
      userId,
      name: { firstName, lastName },
      email,
    });

    await profile.save();

    return res.status(201).json({
      success: { message: "A new profile is created" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res, next) => {};

export const getAdvisors = async (req, res, next) => {
  try {
    const advisors = await Profile.find(
      { $or: [{ role: "mentor" }, { role: "coach" }] },
      "name"
    ).lean();

    if (!advisors) {
      throw new CustomError(`Advisors not found`, 404);
    }

    return res.status(200).json({
      success: { message: "Advisors found" },
      data: { advisors },
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedAdvisors = async (req, res, next) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const advisors = await Profile.findOne({ userId }, "assignedRoles")
      .populate("assignedRoles.mentorId", "name")
      .populate("assignedRoles.coachId", "name")
      .lean();

    if (!advisors) {
      throw new CustomError("Assigned advisors not found", 404);
    }

    return res.status(200).json({
      success: { message: "Advisors populated successfully" },
      data: { advisors },
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedMenteeByMenteeId = async (req, res, next) => {
  const { menteeId } = req.params;

  try {
    if (!menteeId) {
      throw new CustomError("Mentee id is required", 400);
    }

    const mentee = await Profile.findById(menteeId);

    if (!mentee) {
      throw new CustomError("Mentee not found", 401);
    }

    return res.status(200).json({
      success: { message: "Mentee found" },
      data: { mentee },
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
        { "assignedRoles.mentor": profile._id },
        { "assignedRoles.coach": profile._id },
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

export const updateProfile = async (req, res, next) => {
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
        postalCode: value.postalCode,
        country: "US",
      };
    } else if (field === "links") {
      updateData[field] = {
        portfolioUrl: value.portfolioUrl,
        linkedinUrl: value.linkedinUrl,
        githubUrl: value.githubUrl,
      };
    } else if (field === "name") {
      if (!value.firstName) {
        throw new CustomError("First name is required", 400);
      }
      updateData[field] = {
        firstName: value.firstName,
        lastName: value.lastName,
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

export const getProfile = async (req, res, next) => {
  const userId = req.user._id;

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
