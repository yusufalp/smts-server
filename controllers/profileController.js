import Profile from "../models/profileModel.js";

export const getAssignedAdvisors = async (req, res, next) => {
  const userId = req.user._id;
  const field = req.query.field || "name";

  try {
    if (!userId) {
      throw new Error("User id is required");
    }

    const advisors = await Profile.findOne({ userId }, "assigned")
      .populate("assigned.mentor", field)
      .populate("assigned.coach", field);

    if (!advisors) {
      throw new Error("Profile not found");
    }

    res.status(200).json({
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
      throw new Error("User id is required");
    }

    const profile = await Profile.findOne({ userId }, "_id");

    if (!profile) {
      throw new Error("Profile not found");
    }

    const mentees = await Profile.find({
      status: "active",
      $or: [
        { "assigned.mentor": profile._id },
        { "assigned.coach": profile._id },
      ],
    });

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

export const getProfileByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw new Error("User id is required");
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      throw new Error("Profile not found");
    }

    res.status(200).json({
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
      throw new Error("Role is required");
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
      throw new Error("Profile by role not found");
    }

    res.status(200).json({
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
