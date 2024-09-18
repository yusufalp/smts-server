import Profile from "../models/profileModel.js";

export async function authorizeAdmin(req, res, next) {
  try {
    const userId = req.user._id;

    const userProfile = await Profile.findOne({ userId });

    if (!userProfile) {
      throw new Error("Profile not found");
    }

    const { role } = userProfile;

    if (role !== "admin") {
      throw new Error("Access denied");
    }

    next();
  } catch (error) {
    next(error);
  }
}
