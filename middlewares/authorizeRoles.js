import Profile from "../models/profileModel.js";
import CustomError from "../utils/CustomError.js";

async function getRole(userId) {
  try {
    const userProfile = await Profile.findOne({ userId }, "role");

    if (!userProfile) {
      throw new CustomError("Profile not found", 404);
    }

    return userProfile.role;
  } catch (error) {
    throw new CustomError(
      `Failed to retrieve user role: ${error.message}`,
      400
    );
  }
}

export function authorizeRoles(allowedRoles) {
  return async function (req, res, next) {
    try {
      const role = await getRole(req.user._id);

      if (!allowedRoles.includes(role)) {
        throw new CustomError("Access denied", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const authorizeAdmin = authorizeRoles(["admin"]);
