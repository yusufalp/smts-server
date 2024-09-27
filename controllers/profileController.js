import Profile from "../models/profileModel.js";

import CustomError from "../utils/CustomError.js";

export const getAssignedAdvisors = async (req, res, next) => {
  const userId = req.user._id;
  const field = req.query.field || "name";

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const advisors = await Profile.findOne({ userId }, "assigned")
      .populate("assigned.mentor", field)
      .populate("assigned.coach", field);

    if (!advisors) {
      throw new CustomError("Profile not found", 404);
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
    });

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
  const { userId } = req.params;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      throw new CustomError("Profile not found", 400);
    }

    return res.status(200).json({
      success: { message: "Profile found successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfilesByRole = async (req, res, next) => {
  const { field = "", role } = req.query;

  try {
    if (!role) {
      throw new CustomError("Role is required", 400);
    }

    let profiles;

    if (role === "advisor") {
      profiles = await Profile.find(
        { $or: [{ role: "mentor" }, { role: "coach" }] },
        field
      );
    } else {
      profiles = await Profile.find({ role }, field);
    }

    if (!profiles) {
      throw new CustomError("Profile by role not found", 404);
    }

    return res.status(200).json({
      success: { message: "Profiles by role found" },
      data: { profiles },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmail = async (req, res, next) => {
  const { email } = req.body;

  const userId = req.user._id;

  try {
    if (!userId) {
      throw new CustomError("User id is required", 400);
    }

    if (!email) {
      throw new CustomError("Email is required", 400);
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { email },
      { new: true }
    );

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: "Email updated successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  const { line1, line2, city, state, zip } = req.body;

  const userId = req.user._id;

  const address = {
    street: {
      line1,
      line2,
    },
    city,
    state,
    zip,
  };

  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { address },
      { new: true }
    );

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: "Address updated successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLinks = async (req, res, next) => {
  const { portfolio, linkedin, github } = req.body;

  const userId = req.user._id;

  const links = {
    portfolio,
    linkedin,
    github,
  };

  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { links },
      { new: true }
    );

    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    return res.status(200).json({
      success: { message: "Links updated successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};
