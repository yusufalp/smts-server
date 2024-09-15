import Profile from "../models/profileModel.js";

export const getProfilesByUserId = async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      error: { message: "User id is required" },
    });
  }

  try {
    const profile = await Profile.find({ userId });

    if (!profile) {
      return res.status(400).json({
        error: { message: "Profile not found" },
      });
    }

    res.status(200).json({
      success: { message: "Profile retrieved successfully" },
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmail = async (req, res, next) => {};

export const updateAddress = async (req, res, next) => {};

export const updateLinks = async (req, res, next) => {};
