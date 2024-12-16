import Profile from "../models/profileModel.js";
import CustomError from "../utils/CustomError.js";

export const createProfile = async (req, res, next) => {
  const userId = req.user._id;
  const { first, last, email } = req.body;

  try {
    if (!first || !last || !email) {
      throw new CustomError(`Missing required fields`, 400);
    }

    const profile = new Profile({
      userId,
      name: { first, last },
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

export const getAdvisors = async (req, res, next) => {
  try {
    const advisors = await Profile.find(
      { $or: [{ role: "mentor" }, { role: "coach" }] },
      "name"
    ).lean();

    if (!advisors.length) {
      throw new CustomError(`There are no advisors in your organization`, 404);
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

    const advisors = await Profile.findOne({ userId }, "assigned")
      .populate("assigned.mentor", "name")
      .populate("assigned.coach", "name")
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

export const getAssignedMenteeById = async (req, res, next) => {
  const { _id } = req.params;

  try {
    if (!_id) {
      throw new CustomError("Mentee id is required", 400);
    }

    const mentee = await Profile.findById(_id);

    if (!mentee) {
      throw new CustomError("Mentee not found", 401);
    }

    res.status(200).json({
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

export const getProfileByUserId = async (req, res, next) => {
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
      if (!value.first) {
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
