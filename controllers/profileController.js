import Profile from "../models/profileModel.js";

export const getProfile = async (req, res, next) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      throw new Error("User id is required");
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      throw new Error("Profile not found");
    }

    res.status(200).json({
      success: { message: "Profile retrieved successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const getMenteesByAdvisorId = async (req, res, next) => {
  const { advisorId, advisorRole } = req.params;

  try {
    if (!advisorId) {
      throw new Error("Advisor id is required");
    }

    let mentees;
    if (advisorRole === "mentor") {
      mentees = await Profile.find({ "assigned.mentor": advisorId });
    } else if (advisorRole === "coach") {
      mentees = await Profile.find({ "assigned.coach": advisorId });
    }

    if (!mentees) {
      throw new Error("Mentees not found");
    }

    res.status(200).json({
      success: { message: "Mentees retrieved successfully" },
      data: { mentees },
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
      throw new Error("User id is required");
    }

    if (!email) {
      throw new Error("Email is required");
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { email },
      { new: true }
    );

    if (!profile) {
      throw new Error("Profile not found");
    }

    res.status(200).json({
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
      throw new Error("Profile not found");
    }

    res.status(200).json({
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
      throw new Error("Profile not found");
    }

    res.status(200).json({
      success: { message: "Links updated successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};
